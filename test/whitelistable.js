/* global artifacts contract it assert */
const { shouldFail, expectEvent } = require('openzeppelin-test-helpers')
const SukuToken = artifacts.require('SukuToken')

const NO_WHITELIST = 0

contract('Whitelistable', (accounts) => {
  it('should deploy', async () => {
    const tokenInstance = await SukuToken.deployed()
    assert.equal(tokenInstance !== null, true, 'Contract should be deployed')
  })

  it('should allow adding and removing an address to a whitelist', async () => {
    const tokenInstance = await SukuToken.deployed()

    // First allow acct 1 be an administrator
    await tokenInstance.addAdmin(accounts[1], { from: accounts[0] })

    // Check acct 2 whitelist should default to NONE
    let existingWhitelist = await tokenInstance.addressWhitelists.call(accounts[2])
    assert.equal(existingWhitelist, NO_WHITELIST, 'Addresses should have no whitelist to start off with')

    // Add the acct 2 to whitelist 10 - using account 1
    await tokenInstance.addToWhitelist(accounts[2], 10, { from: accounts[1] })

    // Validate it got updated
    let updatedWhitelist = await tokenInstance.addressWhitelists.call(accounts[2])
    assert.equal(updatedWhitelist, 10, 'Addresses should have updated whitelist')

    // Update the whitelist for acct 2 to id 20
    await tokenInstance.addToWhitelist(accounts[2], 20, { from: accounts[1] })

    // Validate it got updated
    updatedWhitelist = await tokenInstance.addressWhitelists.call(accounts[2])
    assert.equal(updatedWhitelist, 20, 'Addresses should have updated whitelist after existing was changed')

    // Remove the address from whitelist
    await tokenInstance.removeFromWhitelist(accounts[2], { from: accounts[1] })

    // Validate it got updated
    updatedWhitelist = await tokenInstance.addressWhitelists.call(accounts[2])
    assert.equal(updatedWhitelist, NO_WHITELIST, 'Addresses should have been removed from whitelist')
  })

  it('should only allow admins adding or removing on whitelists', async () => {
    const tokenInstance = await SukuToken.deployed()

    await shouldFail.reverting(tokenInstance.addToWhitelist(accounts[2], 10, { from: accounts[4] }))
    await shouldFail.reverting(tokenInstance.removeFromWhitelist(accounts[2], { from: accounts[4] }))

    // Now allow acct 4 be an administrator
    await tokenInstance.addAdmin(accounts[4], { from: accounts[0] })

    // Adding and removing should work
    await tokenInstance.addToWhitelist(accounts[2], 10, { from: accounts[4] })
    await tokenInstance.removeFromWhitelist(accounts[2], { from: accounts[4] })

    // Now remove acct 4 from the admin list
    await tokenInstance.removeAdmin(accounts[4], { from: accounts[0] })

    // They should fail again
    await shouldFail.reverting(tokenInstance.addToWhitelist(accounts[2], 10, { from: accounts[4] }))
    await shouldFail.reverting(tokenInstance.removeFromWhitelist(accounts[2], { from: accounts[4] }))
  })

  it('should validate if addresses are not on a whitelist', async () => {
    const tokenInstance = await SukuToken.deployed()

    // First allow acct 1 be an administrator
    await tokenInstance.addAdmin(accounts[1], { from: accounts[0] })

    // Two addresses not on any white list
    let isValid = await tokenInstance.checkSameWhitelist.call(accounts[6], accounts[7])
    assert.equal(isValid, false, 'Two non white listed addresses should not be valid')

    // Add address 6
    await tokenInstance.addToWhitelist(accounts[6], 10, { from: accounts[1] })

    // Only first address on white list should fail
    isValid = await tokenInstance.checkSameWhitelist.call(accounts[6], accounts[7])
    assert.equal(isValid, false, 'First non white listed addresses should not be valid')

    // Remove again
    await tokenInstance.removeFromWhitelist(accounts[6], { from: accounts[1] })

    // Both should fail again
    isValid = await tokenInstance.checkSameWhitelist.call(accounts[6], accounts[7])
    assert.equal(isValid, false, 'Two non white listed addresses should not be valid')

    // Add address 7
    await tokenInstance.addToWhitelist(accounts[7], 10, { from: accounts[1] })

    // Only first address on white list should fail
    isValid = await tokenInstance.checkSameWhitelist.call(accounts[6], accounts[7])
    assert.equal(isValid, false, 'Second non white listed addresses should not be valid')

    // Add address 6 back
    await tokenInstance.removeFromWhitelist(accounts[7], { from: accounts[1] })

    // Both should fail again
    isValid = await tokenInstance.checkSameWhitelist.call(accounts[6], accounts[7])
    assert.equal(isValid, false, 'Two non white listed addresses should not be valid')

    // Add both 6 and 7
    await tokenInstance.addToWhitelist(accounts[6], 10, { from: accounts[1] })
    await tokenInstance.addToWhitelist(accounts[7], 10, { from: accounts[1] })

    // Should be valid
    isValid = await tokenInstance.checkSameWhitelist.call(accounts[6], accounts[7])
    assert.equal(isValid, true, 'Both on same white list should be valid')

    // Update address 6 to a different white list
    await tokenInstance.addToWhitelist(accounts[6], 20, { from: accounts[1] })

    // Should fail
    isValid = await tokenInstance.checkSameWhitelist.call(accounts[6], accounts[7])
    assert.equal(isValid, false, 'Two addresses on separate white lists should not be valid')
  })
})
