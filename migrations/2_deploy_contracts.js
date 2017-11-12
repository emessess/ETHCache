const SimpleStorage = artifacts.require('./SimpleStorage.sol');
const Capsule = artifacts.require('./Capsule.sol');
const CacheGame = artifacts.require('./CacheGame.sol');

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Capsule);
  deployer.deploy(CacheGame);
};
