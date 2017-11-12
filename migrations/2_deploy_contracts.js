const CacheGame = artifacts.require('./CacheGame.sol');

module.exports = function(deployer) {
  deployer.deploy(CacheGame);
};
