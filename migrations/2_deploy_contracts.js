/* global artifacts */
const SukuToken = artifacts.require('SukuToken')

module.exports = function (deployer) {
  deployer.deploy(SukuToken)
}
