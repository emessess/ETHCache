const SimpleStorage = artifacts.require('./SimpleStorage.sol');
const CacheGame = artifacts.require('./CacheGame.sol');

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(CacheGame);
};
