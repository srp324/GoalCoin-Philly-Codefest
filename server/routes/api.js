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

let contract = web3.eth.contract(JSON.parse(abi));
var address;
var owner;

router.get('/deployContract/:owner-:addresses-:reward', (req, res) => { 
    
    res.setHeader('Content-Type', 'application/json');
    const contractInstance = contract.new(parseInt(req.params['reward']), {
        data: '0x' + bytecode,
        from: req.params['owner'],
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
                console.log('Owner address: ' + req.params['owner']);

                //Send reward budgets to storage account
                var addresses = req.params['addresses'].split(",");
                if (address == null) {
                    address = res.address;
                }

                for (var i = 0; i < addresses.length; ++i) {
                    console.log(i + ": " + addresses[i] + " - " + web3.eth.getBalance(addresses[i]) + " -- " + req.params['reward'] / addresses.length + " TO 0xcd0e3666190cfead0e31785864827d029c0d03a6");
                    res.addUser(addresses[i], {from: '0xcd0e3666190cfead0e31785864827d029c0d03a6', gas:3000000});
                    web3.eth.sendTransaction({from: addresses[i], to: '0xcd0e3666190cfead0e31785864827d029c0d03a6', value: web3.toWei(req.params['reward'] / addresses.length, "ether")});
                    
                }

                console.log("Goal created!");
            }
        }
    );
    
    res.send(JSON.stringify(contractInstance));
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
    
    response.data = JSON.parse(contract.at(req.params['address']));
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
});

// Get Contract Address
router.get('/getContract', (req, res) => { 
    console.log(address);
    response.data = [address];
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
});

// Get ABI
router.get('/getABI', (req, res) => { 
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.parse(abi));
});

// Get ABI
router.get('/getABI2', (req, res) => { 
    response.data = JSON.parse(abi);
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
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
router.get('/addWinner/:caddress-:uaddress', (req, res) => { 
    const token = contract.at(req.params['caddress']);

    res.setHeader('Content-Type', 'application/json');
    res.send(token.addWinner(req.params['uaddress'], {from: req.params['uaddress'], gas:3000000}, function(err, res){ console.log("Added " + req.params['uaddress']) }));
});

// Add winners based on contract address and user addresses
router.get('/addWinners/:caddress-:addresses', (req, res) => { 
    const token = contract.at(req.params['caddress']);

    var addresses = req.params['addresses'].split(",");

    for (var i = 0; i < addresses.length; ++i) {
        console.log("Added winner " + addresses[i]);
        token.addWinner(addresses[i], {from: '0xcd0e3666190cfead0e31785864827d029c0d03a6', gas:3000000});  
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
});

// Get Winner
router.get('/getWinner/:caddress-:index', (req, res) => { 
    const token = contract.at(req.params['caddress']);

    res.setHeader('Content-Type', 'application/json');
    res.send(token.getWinner.call(req.params['index'], function(err, res){ console.log(res) }));
});

// Add user based on contract address and user address
router.get('/addUser/:caddress-:uaddress', (req, res) => { 
    const token = contract.at(req.params['caddress']);

    res.setHeader('Content-Type', 'application/json');
    res.send(token.addUser(req.params['uaddress'], {from: req.params['uaddress'], gas:3000000}, function(err, res){ console.log("Added user " + req.params['uaddress']) }));
});

// Add list of users
router.get('/getUsers/:caddress', (req, res) => { 
    const token = contract.at(req.params['caddress']);

    response.data = JSON.stringify({'users': token.getUsers.call(), 'caddress': req.params['caddress'] });
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
});

// Get Owner
router.get('/getOwner/:caddress', (req, res) => { 
    const token = contract.at(req.params['caddress']);

    res.setHeader('Content-Type', 'application/json');
    res.send(token.getOwner.call(function(err, res){ console.log(res) }));
});

//Send ether from one address to another
router.get('/send/:fromaddress-:toaddress-:value', (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    res.send(web3.eth.sendTransaction({from: req.params['fromaddress'], to: req.params['toaddress'], value: web3.toWei(req.params['value'], "ether")}, function(err, res) {console.log("Sent " + req.params['value'] + " ether from " + req.params['fromaddress'] + " to " + req.params['toaddress']);}));
});

//Completion of the goal and distrbute reward money
router.get('/completeGoal/:caddress', (req, res) => {
    const token = contract.at(req.params['caddress']);
    var reward = token.getReward.call();
    var winnersSize = token.getWinnersSize.call();

    for (var i = 0; i < winnersSize; ++i) {
        var winnerAddress = token.getWinner.call(i);
        console.log("Winner " +(i+1) + "(" + winnerAddress + ") has been awarded " + reward / winnersSize + " ether! Good job!");
        web3.eth.sendTransaction({from: '0xcd0e3666190cfead0e31785864827d029c0d03a6', to: winnerAddress, value: web3.toWei(reward / winnersSize, "ether")})
    }

    console.log("Goal complete!");
});

router.get('/getBalance/:address', (req, res) => { 
    const balance = web3.eth.getBalance(req.params['address']);
    console.log(balance);

    response.data = JSON.parse(balance);
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
});

router.get('/getBalances/:addresses', (req, res) => {
    var addresses = req.params['addresses'].split(",");

    for (var i = 0; i < addresses.length; ++i) {
        //console.log(addresses[i] + "'s balance: " + web3.eth.getBalance(address[i]));
        var address = addresses[i];
        response.data.push(JSON.parse("{ \"" + address + "\":\"" + web3.eth.getBalance(address).toString() + "\"}"));
    }

    res.setHeader('Content-Type', 'application/json');
    res.json(response);
});

//Send ether to a contract
router.get('/sendToContract/:caddress-:fromaddress-:value', (req, res) => {
    const token = contract.at(req.params['caddress']);

    res.setHeader('Content-Type', 'application/json');
    res.send(token.AddEth.sendTransaction({from: req.params['fromaddress'], to: token.address, value: web3.toWei(req.params['value'], "ether")}, function(err, res) {console.log("Sent " + req.params['value'] + " ether from " + req.params['fromaddress'] + " to (contract) " + token.address);}));
});

// Test if the contract's goal is closed before and after the goal is closed
// and that a winner is successfully added
function testContract(address) {
    const token = contract.at(address);

    var result = token.isGoalClosed.call(function(err, res){ console.log(res) });
    token.closeGoal({from: '0x18d273f75fcb9aed60b2c226914079b26f6a4f5a', gas:3000000}, function(err, res){ console.log("Goal closed!") });
    result = token.isGoalClosed.call(function(err, res){ console.log(res) });

    token.getWinner.call(0, function(err, res){ console.log(res) });
    token.addWinner('0x18d273f75fcb9aed60b2c226914079b26f6a4f5a', {from: '0x18d273f75fcb9aed60b2c226914079b26f6a4f5a', gas:3000000}, function(err, res){ console.log("Added 0x18d273f75fcb9aed60b2c226914079b26f6a4f5a") });
    token.getWinner.call(0, function(err, res){ console.log(res) });

    console.log("Test finished on " + address);
}

module.exports = router;
