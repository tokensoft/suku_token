/* global artifacts contract it assert web3 */
const { shouldFail, expectEvent } = require('openzeppelin-test-helpers')
const SukuToken = artifacts.require('SukuToken')
const BN = web3.utils.BN

contract('Revocations', (accounts) => {
  it('should deploy', async () => {
    const tokenInstance = await SukuToken.deployed()
    assert.equal(tokenInstance !== null, true, 'Contract should be deployed')

    // Revocations should be enabled by default
    let enabled = await tokenInstance.isRevocationEnabled.call()
    assert.equal(enabled, true, 'Revocations should be enabled by default')
  })

  it('should not allow owner to revoke tokens that are not in an account', async () => {
    const tokenInstance = await SukuToken.deployed()

    // Try to revoke tokens from an account that has 0 balance
    await shouldFail.reverting(tokenInstance.revokeTokens(accounts[9], 10000000, { from: accounts[0] }))
  })

  it('should not allow a non-owner to revoke tokens', async () => {
    const tokenInstance = await SukuToken.deployed()

    // Transfer some tokens to account 1
    await tokenInstance.transfer(accounts[1], 1000, { from: accounts[0] })

    // Try to revoke tokens as a non-owner account
    await shouldFail.reverting(tokenInstance.revokeTokens(accounts[1], 1000, { from: accounts[2] }))

    // Should allow owner to revoke - first get initial balances
    let beforeOwnerBalance = await tokenInstance.balanceOf.call(accounts[0])
    let beforeRevokeBalance = await tokenInstance.balanceOf.call(accounts[1])

    const amountToRevoke = new BN(500)

    // Revoke Tokens as the admin
    await tokenInstance.revokeTokens(accounts[1], amountToRevoke, { from: accounts[0] })

    // Verify balances got updated
    let afterOwnerBalance = await tokenInstance.balanceOf.call(accounts[0])
    let afterRevokeBalance = await tokenInstance.balanceOf.call(accounts[1])

    assert.equal(beforeOwnerBalance.add(amountToRevoke).toString(), afterOwnerBalance.toString(), 'Owner account should have been incrememted after revoke')
    assert.equal(beforeRevokeBalance.sub(amountToRevoke).toString(), afterRevokeBalance.toString(), 'Target account should have been decremented after revoke')
  })

  it('should emit event when revoked', async () => {
    const tokenInstance = await SukuToken.deployed()

    // Transfer some tokens to account 1
    await tokenInstance.transfer(accounts[1], 1000, { from: accounts[0] })

    let ret = await tokenInstance.revokeTokens(accounts[1], 100, { from: accounts[0] })
    expectEvent.inLogs(ret.logs, 'RevocationExecuted', { account: accounts[1], value: new BN(100) })
  })

  it('should not allow a non-owner to turn off revocations', async () => {
    const tokenInstance = await SukuToken.deployed()

    await shouldFail.reverting(tokenInstance.disableRevocations({ from: accounts[2] }))
  })

  it('should be able to turn off revocations for good', async () => {
    const tokenInstance = await SukuToken.deployed()

    // Transfer some tokens to account 1
    await tokenInstance.transfer(accounts[1], 1000, { from: accounts[0] })

    // Prove it works first
    await tokenInstance.revokeTokens(accounts[1], 100, { from: accounts[0] })

    // Disable revocations and ensure event was fired
    let ret = await tokenInstance.disableRevocations({ from: accounts[0] })
    expectEvent.inLogs(ret.logs, 'RevocationDisabled', { owner: accounts[0] })

    // Validate the revocations cannot be performed
    await shouldFail.reverting.withMessage(tokenInstance.revokeTokens(accounts[1], 100, { from: accounts[0] }), 'Revocations are not enabled')
  })
})
