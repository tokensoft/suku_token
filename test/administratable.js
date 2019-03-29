/* global artifacts contract it assert */
const { shouldFail, expectEvent } = require('openzeppelin-test-helpers')
const SukuToken = artifacts.require('SukuToken')

contract('Administratable', (accounts) => {
  it('should deploy', async () => {
    const tokenInstance = await SukuToken.deployed()
    assert.equal(tokenInstance !== null, true, 'Contract should be deployed')
  })

  it('should allow adding and removing for owner', async () => {
    const tokenInstance = await SukuToken.deployed()

    // Validate no owners
    let isAdmin = await tokenInstance.isAdministrator(accounts[1])
    assert.equal(isAdmin, false, 'Account should not be admin by default')

    // Adding an owner to the list should be successful for the owner (address[0])
    await tokenInstance.addAdmin(accounts[1], { from: accounts[0] })
    isAdmin = await tokenInstance.isAdministrator.call(accounts[1])
    assert.equal(isAdmin, true, 'Owner should be able to add admin')

    // Removing the admin should be successful for the owner (address[0])
    await tokenInstance.removeAdmin(accounts[1], { from: accounts[0] })
    isAdmin = await tokenInstance.isAdministrator.call(accounts[1])
    assert.equal(isAdmin, false, 'Owner should be able to remove admin')
  })

  it('should preventing adding and removing for non-owner', async () => {
    const tokenInstance = await SukuToken.deployed()

    // Validate no owners
    let isAdmin = await tokenInstance.isAdministrator(accounts[2])
    assert.equal(isAdmin, false, 'Account should not be admin by default')

    // Adding an address to the list should faile for non-owner (address[1])
    await shouldFail.reverting(tokenInstance.addAdmin(accounts[2], { from: accounts[1] }))

    // Adding the address to admin list should not impact this - only owner can add other admins
    await tokenInstance.addAdmin(accounts[1], { from: accounts[0] })
    await shouldFail.reverting(tokenInstance.addAdmin(accounts[2], { from: accounts[1] }))
  })

  it('should emit events for adding admins', async () => {
    const tokenInstance = await SukuToken.deployed()

    let { logs } = await tokenInstance.addAdmin(accounts[3], { from: accounts[0] })
    expectEvent.inLogs(logs, 'AdminAdded', { addedAdmin: accounts[3], addedBy: accounts[0] })
  })

  it('should emit events for removing admins', async () => {
    const tokenInstance = await SukuToken.new()

    await tokenInstance.addAdmin(accounts[3], { from: accounts[0] })
    const { logs } = await tokenInstance.removeAdmin(accounts[3], { from: accounts[0] })

    expectEvent.inLogs(logs, 'AdminRemoved', { removedAdmin: accounts[3], removedBy: accounts[0] })
  })

  it('should preventing adding an admin when already an admin', async () => {
    const tokenInstance = await SukuToken.new()

    // The first add should succeed
    await tokenInstance.addAdmin(accounts[1], { from: accounts[0] })

    // The second add should fail
    await shouldFail.reverting(tokenInstance.addAdmin(accounts[1], { from: accounts[0] }))
  })

  it('should preventing removing an admin when it is not an admin', async () => {
    const tokenInstance = await SukuToken.new()

    // Add an accct to the admin list
    await tokenInstance.addAdmin(accounts[1], { from: accounts[0] })

    // The first removal should succeed.
    await tokenInstance.removeAdmin(accounts[1], { from: accounts[0] })

    // The second removal should fail
    await shouldFail.reverting(tokenInstance.removeAdmin(accounts[1], { from: accounts[0] }))
  })
})
