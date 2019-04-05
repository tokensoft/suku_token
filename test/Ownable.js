/* global artifacts contract it assert */
const SukuToken = artifacts.require('SukuToken')

/**
 * Sanity check for transferring ownership.  Most logic is fully tested in OpenZeppelin lib.
 */
contract('Ownable', (accounts) => {
  it('should deploy', async () => {
    const tokenInstance = await SukuToken.new(accounts[0])
    assert.equal(tokenInstance !== null, true, 'Contract should be deployed')

    // Current owner
    let owner = await tokenInstance.owner.call()
    assert.equal(owner, accounts[0], 'Default owner should be account 0')

    // Transfer to account 1
    await tokenInstance.transferOwnership(accounts[1])

    // Should have been updated
    owner = await tokenInstance.owner.call()
    assert.equal(owner, accounts[1], 'Updated owner should be account 1')
  })

  it('should deploy with a different owner', async () => {
    const tokenInstance = await SukuToken.new(accounts[1])
    assert.equal(tokenInstance !== null, true, 'Contract should be deployed')

    // Current owner should not be the original caller
    let owner = await tokenInstance.owner.call()
    assert.equal(owner, accounts[1], 'Owner should be account 1')
  })
})
