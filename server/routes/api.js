const express = require('express');
const router = express.Router();
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let source = fs.readFileSync('GoalContract.sol', 'utf8');
let compiledContract = solc.compile(source, 1);
let abi = compiledContract.contracts[':GoalContract'].interface;
let bytecode = compiledContract.contracts[':GoalContract'].bytecode;
let gasEstimate = web3.eth.estimateGas({data: bytecode}); //Not used

let contract = web3.eth.contract(JSON.parse(abi));

const contractInstance = contract.new(1500, {
    data: '0x' + bytecode,
    from: '0x922225717aedc151ca59b8f68e0309be29b79109',
    gas: 3000000
    }, 

    // NOTE: The callback will fire twice!
    // Once the contract has the transactionHash property set and once its deployed on an address.
    (err, res) => {
    if (err) {
        console.log(err);
        return;
    }

    // Log the tx, you can explore status with eth.getTransaction()
    console.log('Txn hash: ' + res.transactionHash);

    // If we have an address property, the contract was deployed
    if (res.address) {
        console.log('Contract address: ' + res.address);

        // Let's test the deployed contract
        //testContract(res.address);
    }
});

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get Contract
router.get('/getContract/:address', (req, res) => { 
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(contract.at(req.params['caddress'])));
});

// Get ABI
router.get('/getABI', (req, res) => { 
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.parse(abi));
});

// Get Reward based on contract address
router.get('/getReward/:address', (req, res) => { 
    const token = contract.at(req.params['address']);

    res.setHeader('Content-Type', 'application/json');
    res.send(token.getReward.call(function(err, res){ console.log(res.toString()) }));
});

// Get goalClosed based on contract address
router.get('/isGoalClosed/:address', (req, res) => { 
    const token = contract.at(req.params['address']);

    res.setHeader('Content-Type', 'application/json');
    res.send(token.isGoalClosed.call(function(err, res){ console.log(res) }));
});

// Add winner based on contract address and user address
// TODO: Switch from to contract owner
router.get('/addWinner/:caddress-:uaddress', (req, res) => { 
    const token = contract.at(req.params['caddress']);

    res.setHeader('Content-Type', 'application/json');
    res.send(token.addWinner(req.params['uaddress'], {from: req.params['uaddress'], gas:3000000}, function(err, res){ console.log("Added " + req.params['uaddress']) }));
});

// Get Winner (hardcoded to 0)
router.get('/getWinner/:caddress-:address', (req, res) => { 
    const token = contract.at(req.params['caddress']);

    res.setHeader('Content-Type', 'application/json');
    res.send(token.getWinner.call(0, function(err, res){ console.log(res) }));
});

//Send ether from one address to another
router.get('/send/:fromaddress-:toaddress-:value', (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    res.send(web3.eth.sendTransaction({from: req.params['fromaddress'], to: req.params['toaddress'], value: web3.toWei(req.params['value'], "ether")}));
});

// Test if the contract's goal is closed before and after the goal is closed
// and that a winner is successfully added
function testContract(address) {
    const token = contract.at(address);

    var result = token.isGoalClosed.call(function(err, res){ console.log(res) });
    token.closeGoal({from: '0x922225717aedc151ca59b8f68e0309be29b79109', gas:3000000}, function(err, res){ console.log("Goal closed!") });
    result = token.isGoalClosed.call(function(err, res){ console.log(res) });

    token.getWinner.call(0, function(err, res){ console.log(res) });
    token.addWinner('0x922225717aedc151ca59b8f68e0309be29b79109', {from: '0x922225717aedc151ca59b8f68e0309be29b79109', gas:3000000}, function(err, res){ console.log("Added 0x922225717aedc151ca59b8f68e0309be29b79109") });
    token.getWinner.call(0, function(err, res){ console.log(res) });

    console.log("Test finished!");
}

module.exports = router;