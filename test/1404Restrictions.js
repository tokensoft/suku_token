/* global artifacts contract it assert */
const SukuToken = artifacts.require('SukuToken')

const SUCCESS_CODE = 0
const FAILURE_NON_WHITELIST = 1
const SUCCESS_MESSAGE = 'SUCCESS'
const FAILURE_NON_WHITELIST_MESSAGE = 'The transfer FROM and TO addresses are not on the same whitelist.'
const UNKNOWN_ERROR = 'Uknown Error Code'

contract('1404 Restrictions', (accounts) => {
  it('should deploy', async () => {
    const tokenInstance = await SukuToken.deployed()
    assert.equal(tokenInstance !== null, true, 'Contract should be deployed')

    // Set account 1 as an admin to update white lists - other tests will assume this
    await tokenInstance.addAdmin(accounts[1])
  })

  it('should deploy', async () => {
    const tokenInstance = await SukuToken.deployed()
    assert.equal(tokenInstance !== null, true, 'Contract should be deployed')

    // Set account 1 as an admin to update white lists - other tests will assume this
    await tokenInstance.addAdmin(accounts[1])
  })

  it('should fail with non whitelisted accounts', async () => {
    const tokenInstance = await SukuToken.deployed()

    // Both not on white list
    let failureCode = await tokenInstance.detectTransferRestriction.call(accounts[5], accounts[6], 100)
    let failureMessage = await tokenInstance.messageForTransferRestriction(failureCode)
    assert.equal(failureCode, FAILURE_NON_WHITELIST, 'Both Non-whitelisted should get failure code')
    assert.equal(failureMessage, FAILURE_NON_WHITELIST_MESSAGE, 'Failure message should be valid for restriction')

    // One added to white list
    await tokenInstance.addToWhitelist(accounts[5], 20, { from: accounts[1] })
    failureCode = await tokenInstance.detectTransferRestriction.call(accounts[5], accounts[6], 100)
    failureMessage = await tokenInstance.messageForTransferRestriction(failureCode)
    assert.equal(failureCode, FAILURE_NON_WHITELIST, 'One Non-whitelisted should get failure code')
    assert.equal(failureMessage, FAILURE_NON_WHITELIST_MESSAGE, 'Failure message should be valid for restriction')

    // Second added to other white list
    await tokenInstance.addToWhitelist(accounts[6], 30, { from: accounts[1] })
    failureCode = await tokenInstance.detectTransferRestriction.call(accounts[5], accounts[6], 100)
    failureMessage = await tokenInstance.messageForTransferRestriction(failureCode)
    assert.equal(failureCode, FAILURE_NON_WHITELIST, 'Both in different whitelist should get failure code')
    assert.equal(failureMessage, FAILURE_NON_WHITELIST_MESSAGE, 'Failure message should be valid for restriction')

    // Second added to first whitelist
    await tokenInstance.addToWhitelist(accounts[6], 20, { from: accounts[1] })
    failureCode = await tokenInstance.detectTransferRestriction.call(accounts[5], accounts[6], 100)
    failureMessage = await tokenInstance.messageForTransferRestriction(failureCode)
    assert.equal(failureCode, SUCCESS_CODE, 'Both in same whitelist should pass')
    assert.equal(failureMessage, SUCCESS_MESSAGE, 'Should be success')

    // First removed from whitelist
    await tokenInstance.removeFromWhitelist(accounts[5], { from: accounts[1] })
    failureCode = await tokenInstance.detectTransferRestriction.call(accounts[5], accounts[6], 100)
    failureMessage = await tokenInstance.messageForTransferRestriction(failureCode)
    assert.equal(failureCode, FAILURE_NON_WHITELIST, 'Both in different whitelist should get failure code')
    assert.equal(failureMessage, FAILURE_NON_WHITELIST_MESSAGE, 'Failure message should be valid for restriction')
  })

  it('should allow whitelists to be removed', async () => {
    const tokenInstance = await SukuToken.deployed()

    // Both not on white list
    let failureCode = await tokenInstance.detectTransferRestriction.call(accounts[7], accounts[8], 100)
    let failureMessage = await tokenInstance.messageForTransferRestriction(failureCode)
    assert.equal(failureCode, FAILURE_NON_WHITELIST, 'Both Non-whitelisted should get failure code')
    assert.equal(failureMessage, FAILURE_NON_WHITELIST_MESSAGE, 'Failure message should be valid for restriction')

    // Lift the restriction
    await tokenInstance.setRestrictionEnabled(false, { from: accounts[0] })

    // Should be successful now
    failureCode = await tokenInstance.detectTransferRestriction.call(accounts[7], accounts[8], 100)
    failureMessage = await tokenInstance.messageForTransferRestriction(failureCode)
    assert.equal(failureCode, SUCCESS_CODE, 'Restrictions disabled should pass anyone')
    assert.equal(failureMessage, SUCCESS_MESSAGE, 'Should be success')
  })

  it('should handle unknown error codes', async () => {
    const tokenInstance = await SukuToken.deployed()

    let failureMessage = await tokenInstance.messageForTransferRestriction(1001)
    assert.equal(failureMessage, UNKNOWN_ERROR, 'Should be unknown error code for restriction')
  })
})
