pragma solidity ^0.4.11;

contract Cache {

    address public finder;
    address public placer;

    uint public bounty;
    uint passphrase;

    // Set to true when cache is found, disallows any change
    bool ended;

    // Events that will be fired on changes.
    event CacheFound(address winnner);

    //constructor
    function Cache (uint _passphrase) {
        placer = msg.sender;
        bounty = msg.value;
        passphrase = _passphrase;
        ended = false;
    }

    //add to the current bounty
    function addBounty() payable {
       bounty += msg.value;
    }

    function checkEnded() constant returns(bool) {
      return ended;
    }

    function checkBounty() constant returns (uint) {
        return bounty;
    }

    /// Attempt to prove you found the cache using code on object
    
    function findCache(uint _code) returns(uint) {
        // If the code is not correct, end the cache game

      if (!ended && _code == passphrase) {
        finder = msg.sender;
        cacheEnd();
        return bounty;
      }
      // if not return 0
        return 0;
    }

    function cacheEnd() internal {
        ended = true;
        CacheFound(finder);

        if (bounty > 1) {
          finder.transfer(bounty);
        }
    }
}