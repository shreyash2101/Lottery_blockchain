const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface,bytecode} = require('../compile');
let accounts;
let lottery;
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode })
    .send({from: accounts[0], gas: '1000000'});

//    lottery.setProvider(provider);
});

describe('lottery deployed :', ()=>{
    it('deploys  contracts', () => {
        assert.ok(lottery.options.address);
      //console.log(lottery);
    });

  it('allow 1 person to enter the  contract  :', async () => {
        await lottery.methods.enter().send({
            from : accounts[0],
             value : web3.utils.toWei('0.02', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });
        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length);
    });

    it('multiple accounts entered : ', async () => {
        await lottery.methods.enter().send({
            from : accounts[0],
             value : web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from : accounts[1],
             value : web3.utils.toWei('0.1', 'ether')
        });
        await lottery.methods.enter().send({
            from : accounts[2],
             value : web3.utils.toWei('0.03', 'ether')
        });
        await lottery.methods.enter().send({
            from : accounts[3],
             value : web3.utils.toWei('0.010000000000000001', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });
        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        assert.equal(accounts[2],players[2]);
        assert.equal(accounts[3],players[3]);
        assert.equal(4,players.length);
    });

    it('checking mimimum amount to enter :',async () => {
        try{
            await lottery,methods.enter().send({
                from: accounts[0],
                value : web3.utils.toWei('0.01','ether')
            });
            assert(false);
        }

        catch(err){
            assert(err);
        }
    }) ;
    it('only manager can call pickWinner function', async () => {
        try{
            await lottery.methods.pickWinner().send({
                from : accounts[1]});
                assert(false);
        }
        catch(err){
            assert(err);
        }

    } );

    it('winner get the money', async () =>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value : web3.utils.toWei('2','ether')
        });
        const initial_balance = await web3.eth.getBalance(accounts[0]);
        //console.log(initial_balance);
        await lottery.methods.pickWinner().send({from : accounts[0]});
        const final_balance = await web3.eth.getBalance(accounts[0]);
        //console.log(final_balance);
        const  difference = final_balance - initial_balance;
       // console.log(difference);
        assert(difference > web3.utils.toWei('1.8','ether')); 
       });
});