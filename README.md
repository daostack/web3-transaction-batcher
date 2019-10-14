# Ethereum Transaction Batcher


A utility to batch ethereum transactions in a single transaction.

## Why use this?

- better user experience if you need do send (or re-send) many transactions
- safe gas
## Usage

Install the package `npm install ethereum-transaction-batcher`

```javascript
const Web3 = require('web3')
const batcher = require('ethereum-transaction-batcher')

// the address where the helper contrat is deployed
const batcherAddress = '0x741A4dCaD4f72B83bE9103a383911d78362611cf'
const web3 = new Web3('http://localhost:8545/') // or another ethereum provider

batcher.initialize(web3, batcherAddress)

// create web3 transactions as you would normally
const tx1 = myContract.myMethod(myArg1, myarg2)

// deploy a contract
const tx2 = {
  data: '0x123454...',
}
// call a function on a contract
const tx3 = {
  to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
  data: '0x123454...',
}
// send some money to your friend
const tx4 =  {
  to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
  value: '1000000000000000'
}

// send the transactions as a single transaction to the blockchain
const receipt = await batcher.sendTransaction([tx1, tx2, tx3, tx4])



```
## API


```javascript
batcher.initialize(
  web, // web3 instance, required
  batcherAdddress // address of batcher contract, optional if the network is main or rinkeby
)
```

```javascript
batcher.sendTransaction(
  transactions, // a list of web3-style transaction objects
  callback // optional, like in web3.js
)

```
`sendTransaction` behaves like `web3.eth.sendTransaction` -if a callback is provided, it will be called, if no callback is provided, it will return a promise that resolves to a transaction receipt. 





# License

[GNU GPL](./LICENSE)
