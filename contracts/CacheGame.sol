
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
  
  mapping (address => Cache) caches;

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
      passphrase: _passphrase,
      found: false
    });

    openCaches.push(caches[msg.sender]);

  }

//view an active cache

  function viewCache(uint index) returns(bytes32) {
    return caches[msg.sender].title;
  }

//solve an existing cache

  // function solveCache(address solvedAddress, bytes32 passPhrase) returns(bool) {
  //   //check validity
  //   require(keccak256(caches[solvedAddress].passphrase) == keccak256(passPhrase));
    
  //   //declare bounty
  //   uint bountyAmount = caches[solvedAddress].bounty;
    
  //   //set cache to found and zero out bounty
  //   caches[solvedAddress].found = true;
  //   caches[solvedAddress].bounty = 0;

  //   //pay bounty
  //   msg.sender.transfer(bountyAmount);

  // }






}