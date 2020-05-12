const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const{interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
'suggest describe wink crater turn attract prize light school hire honey nose',
'https://rinkeby.infura.io/v3/cd51fb54153a4a8e9e790775b59a0a71'
);

const web3 = new Web3(provider);
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('account 1 :', accounts[0]);

   const result = await new web3.eth.Contract(JSON.parse(interface))
     .deploy({data: '0x' + bytecode }) // add 0x bytecode
     .send({from: accounts[0]}); // remove 'gas'
    console.log(interface);
    console.log('contract deploys address : ', result.options.address);

};

deploy();
