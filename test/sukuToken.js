/* global artifacts contract it assert */
const SukuToken = artifacts.require('SukuToken')

contract('SukuToken', (accounts) => {
  it('should deploy', async () => {
    const tokenInstance = await SukuToken.deployed()
    assert.equal(tokenInstance !== null, true, 'Contract should be deployed')
  })
})
