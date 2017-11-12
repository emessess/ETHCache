const CacheGame = artifacts.require("./CacheGame.sol");

contract('CacheGame', function(accounts) {

  let cacheGameInstance;

  it("...should create a cache with given parameters", function() {
    return CacheGame.deployed().then(function(instance) {
      cacheGameInstance = instance;

      return cacheGameInstance.createCache(
        'first cache',
        'it is somewhere',
        'this is the passphrase', 
        {from: accounts[0], value: 3});
    }).then(function() {
      return cacheGameInstance.viewCache.call(accounts[0], {from: accounts[1]});
    }).then(function(storedData) {
      console.log(storedData);
      assert.equal(storedData[0], '0x6669727374206361636865000000000000000000000000000000000000000000' , "lets just see what happens");
    });
  });

  it("should allow players to solve a cache with the address and correct passphrase", function() {
    CacheGame.deployed().then(function(instance){
      cacheGameInstance = instance;
      return cacheGameInstance.solveCache(accounts[0], 'this is the passphrase', {from: accounts[1]})
    })
  }) 
});

