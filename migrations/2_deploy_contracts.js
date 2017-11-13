const CacheGame = artifacts.require('./CacheGame.sol');
const Cache = artifacts.require('./Cache.sol');

module.exports = function(deployer) {
  deployer.deploy(CacheGame);
  deployer.deploy(Cache);
};
