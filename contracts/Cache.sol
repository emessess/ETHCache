pragma solidity ^0.4.11;

contract Cache {
    // Parameters of the auction. Times are either
    // absolute unix timestamps (seconds since 1970-01-01)
    // or time periods in seconds.
    address public finder;
    address public placer;

    // Current state of the auction.
    uint public bounty;
    uint passphrase;

    // Set to true at the end, disallows any change
    bool ended;

    // Events that will be fired on changes.
    event CacheFound(address winnner);

    function Cache (
        uint _passphrase,
        address _placer
    ) {
        placer = _placer;
        bounty = 0;
        passphrase = _passphrase;
        
    }

    function addBounty() payable {
       require(ended == false);
       bounty = bounty + msg.value;
    }

    function checkBounty() constant returns (uint) {
        return bounty;
    }

    /// Bid on the auction with the value sent
    /// together with this transaction.
    /// The value will only be refunded if the
    /// auction is not won.
    function findCache(uint _code) returns(uint) {
        // If the bid is not higher, send the
        // money back.
      if (_code == passphrase) {
        finder = msg.sender;
        cacheEnd();
        return bounty;
      }
        return 0;
    }


    /// End the auction and send the highest bid
    /// to the beneficiary.
    function cacheEnd() internal {
        // It is a good guideline to structure functions that interact
        // with other contracts (i.e. they call functions or send Ether)
        // into three phases:
        // 1. checking conditions
        // 2. performing actions (potentially changing conditions)
        // 3. interacting with other contracts
        // If these phases are mixed up, the other contract could call
        // back into the current contract and modify the state or cause
        // effects (ether payout) to be performed multiple times.
        // If functions called internally include interaction with external
        // contracts, they also have to be considered interaction with
        // external contracts.

        // 1. Conditions

        // 2. Effects
        ended = true;
        CacheFound(finder);

        // 3. Interaction
        if (bounty > 1) {
          finder.transfer(bounty);
        }
    }
}