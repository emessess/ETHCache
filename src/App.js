import React, { Component } from 'react'
import Cache from '../build/contracts/Cache.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract')
const cacheGame = contract(Cache);

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accounts: [],
      bounty: 0,
      web3: null,
      meta: null,
      newMsgInput: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkChain = this.checkChain.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {

    var meta;

    cacheGame.setProvider(this.state.web3.currentProvider);
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      cacheGame.deployed(123, accounts[0]).then((instance) => {
        meta = instance;
        this.setState({ accounts, meta })
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return this.state.meta.checkBounty.call();
      }).then((result) => {
        // Update state with the result.
        // let stringResult = this.state.web3.toAscii(result[0]);
        return this.setState({ bounty: result.c[0]})
      }).catch()
    })
  }

  handleChange(event) {
    this.setState({newMsgInput: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault();
    this.state.meta.addBounty({from: this.state.accounts[0], value: +event.target.value})
    .then(transaction => {
      //transaction object is here now, could use to render transaction reciept number
      console.log(transaction);
      this.setState({newMsgInput: ''});
    })


  }

  checkChain() {
    this.state.checkBounty.call()
    .then(result => {
      return this.setState({ bounty: result.c[0]})
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">ETHCache</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Can you find the cache?</h1>
            </div>
            <div className="pure-u-1-1">
              <p>Cache Name:</p>
              <p>Cache Bounty: {this.state.bounty}</p>
              <p>Cache Hit:</p>
              <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Add bounty..." maxLength="32" value={this.state.newMsgInput} onChange={this.handleChange}/>
                <input type="submit" value="Submit" />
              </form>
              <button onClick={this.checkChain}>Check Chain</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
