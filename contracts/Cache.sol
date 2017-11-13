pragma solidity ^0.4.11;

contract Cache {
    address public finder;
    address public placer;

    // Current state of the game
    uint public bounty;
    uint passphrase;

    // Set to true when cache is found, disallows any change
    bool ended;

    // Events that will be fired on changes.
    event CacheFound(address winnner);

    //constructor
    function Cache (uint _passphrase, address _placer) {
        placer = _placer;
        bounty = 0;
        passphrase = _passphrase;
        
    }

    //add to the current bounty
    function addBounty() payable {
       require(ended == false);
       bounty = bounty + msg.value;
    }

    function checkBounty() constant returns (uint) {
        return bounty;
    }

    /// Attempt to prove you found the cache using code on object
    
    function findCache(uint _code) returns(uint) {
        // If the code is not correct, end the cache game

      if (_code == passphrase) {
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