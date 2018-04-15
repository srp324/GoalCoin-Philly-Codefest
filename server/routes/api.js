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
let gasEstimate = web3.eth.estimateGas({data: bytecode});
let contract = web3.eth.contract(JSON.parse(abi));

const contractInstance = contract.new({
    data: '0x' + bytecode,
    from: '0x922225717aedc151ca59b8f68e0309be29b79109',
    gas: gasEstimate 
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
        testContract(res.address);
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
router.get('/createContract', (req, res) => { 
    res.setHeader('Content-Type', 'application/json');
    res.send(contractInstance.address);
});

// Get Contract
router.get('/getABI', (req, res) => { 
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.parse(abi));
});

router.get('/isGoalClosed/:address', (req, res) => { 
    const token = contract.at(req.params['address']);

    res.setHeader('Content-Type', 'application/json');
    res.send(token.isGoalClosed.call(function(err, res){ console.log(res) }));
});

function testContract(address) {
    // Reference to the deployed contract
    const token = contract.at(address);

    var result = token.isGoalClosed.call(function(err, res){ console.log(res) });
    token.closeGoal({from: '0x922225717aedc151ca59b8f68e0309be29b79109', gas:3000000}, function(err, res){ console.log("Goal closed!"); });
    result = token.isGoalClosed.call(function(err, res){ console.log(res) });

}

module.exports = router;