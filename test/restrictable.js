/* global artifacts contract it assert */
const { shouldFail, expectEvent } = require('openzeppelin-test-helpers')
const SukuToken = artifacts.require('SukuToken')

contract('Restrictable', (accounts) => {
  it('should deploy', async () => {
    const tokenInstance = await SukuToken.deployed()
    assert.equal(tokenInstance !== null, true, 'Contract should be deployed')
  })

  it('should default to restriction enabled and be changeable', async () => {
    const tokenInstance = await SukuToken.deployed()

    // Check initial value
    let isRestricted = await tokenInstance.isRestrictionEnabled.call()
    assert.equal(isRestricted, true, 'Should be restricted by default')

    // Let the owner update
    await tokenInstance.disableRestrictions({ from: accounts[0] })

    // Should now be disabled
    isRestricted = await tokenInstance.isRestrictionEnabled.call()
    assert.equal(isRestricted, false, 'Should be disabled by admin')
  })

  it('should only allow owner to update', async () => {
    const tokenInstance = await SukuToken.deployed()

    await shouldFail.reverting(tokenInstance.disableRestrictions({ from: accounts[5] }))
    await shouldFail.reverting(tokenInstance.disableRestrictions({ from: accounts[6] }))
  })

  it('should trigger events', async () => {
    const tokenInstance = await SukuToken.deployed()

    // Turn it off
    let ret = await tokenInstance.disableRestrictions({ from: accounts[0] })
    expectEvent.inLogs(ret.logs, 'RestrictionEnabledUpdated', { enabled: false, owner: accounts[0] })
  })

  it('should fail to be disabled on the second try', async () => {
    const tokenInstance = await SukuToken.new()

    // First time should succeed
    await tokenInstance.disableRestrictions({ from: accounts[0] })

    // Second time should fail
    await shouldFail.reverting(tokenInstance.disableRestrictions({ from: accounts[0] }))
  })
})
