
pragma solidity ^0.4.2;

contract CacheGame {
  
  struct Cache {
    address creator;
    uint bounty;
    bytes32 title;
    bytes32 hint;
    bytes32 passphrase;
    bool found;
  }
  
  mapping (address => Cache) public caches;

  Cache[] public openCaches;
  Cache[] public closedCaches;

// make a new cache

  function createCache(bytes32 _title, bytes32 _hint, bytes32 _passphrase) public payable 
  {
    caches[msg.sender] = Cache({
      creator: msg.sender,
      bounty: msg.value,
      title: _title,
      hint: _hint,
      passphrase: keccak256(_passphrase),
      found: false
    });

    openCaches.push(caches[msg.sender]);

  }

//solve an existing cache

  function solveCache(address cacheAddress, bytes32 passPhrase) public 
  {
    //check validity
    require(keccak256(caches[cacheAddress].passphrase) == keccak256(passPhrase));
    
    //declare bounty
    uint bountyAmount = caches[cacheAddress].bounty;
    
    //set cache to found and zero out bounty
    caches[cacheAddress].found = true;
    caches[cacheAddress].bounty = 0;

    //pay bounty
    msg.sender.transfer(bountyAmount);

  }

//view an active cache

  function viewCache(address cacheAddress) public constant returns(bytes32, bytes32, uint) {
    return (caches[cacheAddress].title, caches[cacheAddress].hint, caches[cacheAddress].bounty);
  }





}