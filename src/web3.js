import Web3 from 'web3';
//const web3 = new Web3(window.web3.currentProvider);
const web3 = new Web3(window.ethereum);
window.ethereum.enable();
web3.eth.getAccounts().then(console.log); 
export default web3;