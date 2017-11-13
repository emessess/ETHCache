import React, { Component } from 'react'
import CacheGame from '../build/contracts/CacheGame.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract')
const cacheGame = contract(CacheGame);

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: '',
      accounts: [],
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

    let cacheGameInstance;

    cacheGame.setProvider(this.state.web3.currentProvider);
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      cacheGame.deployed().then((instance) => {
        cacheGameInstance = instance;
        this.setState({ accounts, meta: cacheGameInstance })
        return this.state.meta.createCache(
          'first cache',
          'it is somewhere',
          'this is the passphrase', 
          {from: accounts[0], value: 1, gas: 500000});
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        console.log(result);
        return this.state.meta.viewCache.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        // let stringResult = this.state.web3.toAscii(result[0]);
        return this.setState({ storageValue: result })
      }).catch()
    })
  }

  handleChange(event) {
    this.setState({newMsgInput: event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault();
    cacheGame.deployed().then(instance => {
      return instance.setMessage(this.state.newMsgInput, {from: this.state.accounts[0]})
    }).then(transaction => {
      //transaction object is here now, could use to render transaction reciept number
      console.log(transaction);
      this.setState({newMsgInput: ''});
    })


  }

  checkChain() {
    cacheGame.deployed().then(instance => {
      return instance.getMessage.call(this.state.accounts[0])
    }).then(result => {
      let stringResult = this.state.web3.toAscii(result);
      return this.setState({ storageValue: stringResult})
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Note To Self</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Ethereum Time Capsule</h1>
              <form onSubmit={this.handleSubmit}>
                <input type="text" maxLength="32" value={this.state.newMsgInput} onChange={this.handleChange}/>
                <input type="submit" value="Transact" />
              </form>
            </div>
            <div className="pure-u-1-1">
              <p>Your message is: {this.state.storageValue}</p>
              <button onClick={this.checkChain}>Check Chain</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
