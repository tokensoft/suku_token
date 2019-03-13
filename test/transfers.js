/* global artifacts contract it assert */
const { shouldFail } = require('openzeppelin-test-helpers')
const SukuToken = artifacts.require('SukuToken')

const FAILURE_NON_WHITELIST_MESSAGE = 'The transfer FROM and TO addresses are not on the same whitelist.'

contract('Transfers', (accounts) => {
  it('should deploy', async () => {
    const tokenInstance = await SukuToken.deployed()
    assert.equal(tokenInstance !== null, true, 'Contract should be deployed')

    // Set account 1 as an admin to update white lists - other tests will assume this
    await tokenInstance.addAdmin(accounts[1])
  })

  it('Should allow the owner to send to anyone regardless of whitelist', async () => {
    const tokenInstance = await SukuToken.deployed()

    // Send to some non-whitelisted accounts
    await tokenInstance.transfer(accounts[7], 100, { from: accounts[0] })
    await tokenInstance.transfer(accounts[8], 100, { from: accounts[0] })
    await tokenInstance.transfer(accounts[9], 100, { from: accounts[0] })
  })

  it('Initial transfers should fail but succeed after white listing', async () => {
    const tokenInstance = await SukuToken.deployed()

    // Send some initial tokens to account 5
    await tokenInstance.transfer(accounts[5], 10000, { from: accounts[0] })

    // Try to send to account 2
    await shouldFail.reverting.withMessage(tokenInstance.transfer(accounts[2], 100, { from: accounts[5] }), FAILURE_NON_WHITELIST_MESSAGE)

    // Approve a transfer from account0 and then try to spend it
    await tokenInstance.approve(accounts[2], 100, { from: accounts[5] })
    await shouldFail.reverting.withMessage(tokenInstance.transferFrom(accounts[5], accounts[2], 100, { from: accounts[2] }), FAILURE_NON_WHITELIST_MESSAGE)

    // Add address 0 to whitelist
    await tokenInstance.addToWhitelist(accounts[5], 20, { from: accounts[1] })

    // Try to send to account 2 should still fail
    await shouldFail.reverting.withMessage(tokenInstance.transfer(accounts[2], 100, { from: accounts[5] }), FAILURE_NON_WHITELIST_MESSAGE)
    await shouldFail.reverting.withMessage(tokenInstance.transferFrom(accounts[5], accounts[2], 100, { from: accounts[2] }), FAILURE_NON_WHITELIST_MESSAGE)

    // Remove address 2 to whitelist
    await tokenInstance.addToWhitelist(accounts[2], 20, { from: accounts[1] })

    // Should succeed
    await tokenInstance.transfer(accounts[2], 100, { from: accounts[5] })
    await tokenInstance.transferFrom(accounts[5], accounts[2], 100, { from: accounts[2] })

    // Now account 2 should have 200 tokens
    let balance = await tokenInstance.balanceOf.call(accounts[2])
    assert.equal(balance, '200', 'Transfers should have been sent')

    // Remove account 2 from the white list
    await tokenInstance.removeFromWhitelist(accounts[2], { from: accounts[1] })

    // Should fail trying to send back to account 0 from 2
    await shouldFail.reverting.withMessage(tokenInstance.transfer(accounts[5], 100, { from: accounts[2] }), FAILURE_NON_WHITELIST_MESSAGE)

    // Should fail with transfer from going back to account 0 from 2
    await tokenInstance.approve(accounts[5], 100, { from: accounts[2] })
    await shouldFail.reverting.withMessage(tokenInstance.transferFrom(accounts[2], accounts[5], 100, { from: accounts[5] }), FAILURE_NON_WHITELIST_MESSAGE)
  })
})
