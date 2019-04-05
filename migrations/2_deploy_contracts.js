/* global artifacts */
const SukuToken = artifacts.require('SukuToken')

module.exports = function (deployer, network, accounts) {
  deployer.deploy(SukuToken, accounts[0])
}
