pragma solidity ^0.4.20;

contract GoalContract {
    address public owner;
    uint public reward;
    address[] public winners;
    address[] public users;
    uint winnersCount;
    mapping (address => uint) public balanceOf; // This creates an array with all balances
    bool public goalClosed;
    

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function GoalContract(uint _reward) public {
        owner = msg.sender;
        balanceOf[owner] = _reward;              // Attribute the owner with the reward prize
        reward = _reward;
        goalClosed = false;
        winnersCount = 0;
    }
    
    function closeGoal() public returns (bool) {
        goalClosed = true;
        return goalClosed;
    }
    
    function addWinner(address _winner) public {
        winners.push(_winner);
        winnersCount += 1;
    }
    
    function addUser(address _user) public {
        users.push(_user);
    }
    
    function transferToWinners() public {
        require(goalClosed); //Make sure goal is closed in order to pay out rewards
        for (uint i=0; i<winners.length; i++) {
            transfer(winners[i], reward / winners.length);
        }
    }

    /* Send coins */
    function transfer(address _to, uint _value) public {
        //require(balanceOf[owner] >= _value);           // Check if the sender has enough
        require(balanceOf[_to] + _value >= balanceOf[_to]); // Check for overflows
        //balanceOf[owner] -= _value;                    // Subtract from the sender
        balanceOf[_to] += _value;                           // Add the same to the recipient
    }
    
    function isGoalClosed() public returns (bool) {
        return goalClosed;
    }
    
    function getReward() public returns (uint) {
        return reward;
    }
    
    function getWinner(uint index) public returns (address) {
        return winners[index];
    }
    
    function getWinnersSize() public returns (uint) {
        return winnersCount;
    }
    
    function getUsers() public returns (address[]) {
        return users;
    }
    
    function getOwner() public returns (address) {
        return owner;
    }
    
    function AddEth () payable {}
}
