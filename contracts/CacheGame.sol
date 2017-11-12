
pragma solidity ^0.4.2;

contract CacheGame {
  
  struct Cache {
    address creator;
    uint bounty;
    bytes32 title;
    bytes32 hint;
    string passphrase;
    bool found;
  }
  
  mapping (address => Cache) public caches;

  Cache[] public openCaches;
  Cache[] public closedCaches;

  function createCache(bytes32 _title, bytes32 _hint, string _passphrase) payable 
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

  function viewCache(address cacheAddress) constant returns(bytes32, bytes32, uint) {
    return (caches[cacheAddress].title, caches[cacheAddress].hint, caches[cacheAddress].bounty);
  }




}