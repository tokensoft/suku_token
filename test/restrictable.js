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
    await tokenInstance.setRestrictionEnabled(false, { from: accounts[0] })

    // Should now be disabled
    isRestricted = await tokenInstance.isRestrictionEnabled.call()
    assert.equal(isRestricted, false, 'Should be disabled by admin')

    // Turn it back on
    await tokenInstance.setRestrictionEnabled(true, { from: accounts[0] })

    // Should now be enabled now
    isRestricted = await tokenInstance.isRestrictionEnabled.call()
    assert.equal(isRestricted, true, 'Should be allowed to turn back on by admin')
  })

  it('should only allow owner to update', async () => {
    const tokenInstance = await SukuToken.deployed()

    await shouldFail.reverting(tokenInstance.setRestrictionEnabled(true, { from: accounts[5] }))
    await shouldFail.reverting(tokenInstance.setRestrictionEnabled(false, { from: accounts[6] }))
  })

  it('should trigger events', async () => {
    const tokenInstance = await SukuToken.deployed()

    // Turn it off
    let ret = await tokenInstance.setRestrictionEnabled(false, { from: accounts[0] })
    expectEvent.inLogs(ret.logs, 'RestrictionEnabledUpdated', { enabled: false, owner: accounts[0] })

    // Turn it on
    ret = await tokenInstance.setRestrictionEnabled(true, { from: accounts[0] })
    expectEvent.inLogs(ret.logs, 'RestrictionEnabledUpdated', { enabled: true, owner: accounts[0] })
  })
})