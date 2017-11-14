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
      bounty: 5000,
      web3: null,
      meta: null,
      newMsgInput: '',
      solveInput: '',
      ended: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmitBounty.bind(this);
    this.handleSubmitSolve = this.handleSubmitSolve.bind(this);
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
      cacheGame.deployed(123, {from: accounts[0]}).then((instance) => {
        meta = instance;
        this.setState({ accounts, meta })
      }).then((result) => {
        return this.state.meta.checkBounty.call();
      }).then((result) => {
        this.setState({ bounty: result.c[0]});  //HACK hardcode to show bounty in JSX while working it out
        return this.state.meta.checkEnded.call();
      }).then(ended => this.setState({ended}))
    })
  }

  handleChange(event) {
    if (event.target.name === "bounty") this.setState({newMsgInput: event.target.value});
    if (event.target.name === "solve") this.setState({solveInput: event.target.value});
  }

  handleSubmitBounty(event) {
    event.preventDefault();
    return this.state.meta.addBounty({from: this.state.accounts[0], to: this.state.meta.address, value: +event.target.value})
    .then(transaction => {
      //transaction object is here now, could use to render transaction reciept number
      console.log(transaction);
      this.setState({newMsgInput: ''});
    })
  }
  handleSubmitSolve(event) {
    event.preventDefault();
    this.setState({solveInput: ''});
    this.state.meta.findCache(+event.target.value, {from: this.state.accounts[0]})
    .then(transaction => {
      console.log(transaction);
      return this.state.meta.checkEnded.call()
    })
    .then(value => this.setState({ended: value}))
  }

  checkChain() {
    this.state.meta.checkBounty().then(num => {
      this.setState({bounty: num.c[0]})
      this.state.meta.checkEnded.call().then(value => {
        console.log(value);
      })
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
              <h1>Lady on the Lake</h1>
            </div>
            <div className="pure-u-1-1">
              <div>
                {this.state.ended && <h3>Solved!</h3>}
              </div>
              <p>Geohash: u4pruydqqvj</p>
              <p>Range: 500 ft</p>
              <p>Bounty: 1.25 ETH</p>
              <p>Hint: <em>You knew her as a child. Always finds the sunniest spot, always before noon.</em></p>
              <form onSubmit={this.handleSubmit}>
                <input name="bounty" type="text" placeholder="Enter amount..." maxLength="32" value={this.state.newMsgInput} onChange={this.handleChange}/>
                <input type="submit" value="Add Bounty" />
              </form>
              <form onSubmit={this.handleSubmitSolve}>
                <input name="solve" type="text" placeholder="Enter code..." maxLength="32" value={this.state.solveInput} onChange={this.handleChange}/>
                <input type="submit" value="Solve Cache" />
              </form>
              <button onClick={this.checkChain}>Check for chain updates.</button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
