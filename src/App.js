import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

state ={
  manager : '',
  players : [],
  balance : '',
  value: '',
  message : '',
  accounts : []
};
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager,players,balance  });
  }
  onSubmit = async (event) =>{
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({accounts : accounts});
    
    this.setState({message : 'waiting for transcation sucess............'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')      
    });

    this.setState({message : 'you have entered !'});
  };

  onClick = async () =>{
    const accounts = await web3.eth.getAccounts();
    this.setState({message : 'waiting for transcation sucess............'});
    
    await lottery.methods.pickWinner().send({
      from : accounts[0]
    });
    this.setState({message : 'a winner have been choosen.'});


  };
  render() {
    
    return (
     <div>
       <h2>LOTTERY CONTRACT</h2>
       <p>this contract is managed by {this.state.manager}  and 
          there are currently {this.state.players.length} people in  the compititon 
          to win { web3.utils.fromWei(this.state.balance, 'ether')} ethers !
       </p>
       <hr />
       <form onSubmit={this.onSubmit}>
         <h4> want to try your luck ? </h4>
         <div>
           <label>Amount of ether to enter </label>
           <input
           value = {this.state.value}
            onChange={event => this.setState({value : event.target.value})} 
           />
         </div>
         <button> ENTER</button>
       </form>

       <hr />
        <h1>pick a winner ?</h1>
        <button onClick = {this.onClick}>pick a winner</button>
       <hr />
        <h1>{this.state.accounts.length}</h1>
        <h1>{this.state.message}</h1> 
     </div>
    );
  }
}

export default App;
