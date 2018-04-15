# GoalCoin-Philly-Codefest
A goal-oriented cryptocurrency reward system

### Members:
```
George Lippincott
Sagar Patel
Tim Nguyen
Nahid Sarker
```

### Run:
Run ```node server``` in top level directory. Then visit ```localhost:3000```

### Use Case:

Provide incentives to users to compete beneficial goals. 
There will be an administrator of the goal that handles the successful completion of the goals.
When the goal is completed, the user will be paid in either Ethereum or a custom-made token.

### Example runs:

Deploy contract:
http://localhost:3000/api/deployContract/0xd96b94aa51c36155dbf92477653f2d9fd82dcc5a-0x3ab9b144483b6162f6ec26ed107a7ae178bd8798,0x230caebab0bad6745fa40873cd0c422cda2e463c,0x0f54bb29c997f5a92abb0b3bb0bb1744f0c9535a-15

Add winners:
http://localhost:3000/api/addWinner/0x03c1931e78123fafa072cfa829a19998b250ca4b-0x3ab9b144483b6162f6ec26ed107a7ae178bd8798
http://localhost:3000/api/addWinner/0x03c1931e78123fafa072cfa829a19998b250ca4b-0x230caebab0bad6745fa40873cd0c422cda2e463c
http://localhost:3000/api/addWinner/0x03c1931e78123fafa072cfa829a19998b250ca4b-0x0f54bb29c997f5a92abb0b3bb0bb1744f0c9535a

Complete goal and redistribute reward:
http://localhost:3000/api/completeGoal/0x03c1931e78123fafa072cfa829a19998b250ca4b
