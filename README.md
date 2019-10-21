# Ethereum Transaction Batcher

[![Build Status](https://travis-ci.com/daostack/web3-transaction-batcher.svg?branch=master)](https://travis-ci.com/daostack/web3-transaction-batcher)

A utility to batch Ethereum transactions in a single transaction.

## Why use this?

- better user experience if you need do send (or re-send) many transactions
- save gas
- execute a sequence of transactions as an atomic transaction - if one fails, all do

## Usage

Install the package `npm install ethereum-transaction-batcher`.


```javascript
const Web3 = require('web3')
const Batcher = require('ethereum-transaction-batcher')

// the address where the helper contrat is deployed
const batcherAddress = '0x741A4dCaD4f72B83bE9103a383911d78362611cf'
const web3 = new Web3('http://localhost:8545/') // or another ethereum provider

batcher = new Batcher({web3, batcherAddress})

// create web3 transactions as you would normally
const tx1 = myContract.myMethod(myArg1, myarg2)

// call a function on a contract
const tx2 = {
  to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
  data: '0x123454...',
}
// send some money to your friend
const tx3 =  {
  to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
  value: '1000000000000000'
}

// send the transactions as a single transaction to the blockchain
// the batched transaction will fail if one of the subtransactions fail
const receipt = await batcher.sendTransaction([tx1, tx2, tx3])


```
## API


```javascript
const batcher = new Batcher({
  web, // web3 instance, required
  batcherAdddress // address of batcher contract, optional if the network is main or rinkeby
})
```

A `Batcher` instance exposes a fucntion `sendTransaction`. The signature and behavior of the function is similar to the [sendTransaction method in web3.js](https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#sendtransaction) - the function can be called by providing it with a callback,
if the callback is omitted it will return a Promise - but instead of taking a single transaction object as its first argument, it takes a list of transactions.

```javascript
batcher.sendTransaction(
  transactions, // a list of web3-style transaction objects
  callback // optional, like in web3.js
)
```

The `batcher.sendTransaction` call will try to execute the entire list of transactions in the order that they are given. If one of them fails, the batched transaction fails atomically - i.e.\ none of the transactions will be executed.  

`sendTransaction` behaves like `web3.eth.sendTransaction` - if a callback is provided, it will be called, if no callback is provided, it will return a promise that resolves to a transaction receipt.

## The Contract

The [solidity code](./contracts/Batcher.sol) is here.

## Limitations

* The batched transactions will be sent from the Batcher contract - which means that transactions that require `msg.sender` to be (say) the account  with which the batched transaction is signed, will fail. However, the batcher _will_ work when for sending Ether in batch transactions.
* The batcher contract can only cal functions on existing contracts - it does not create new contracts

## TODO

* use assembly `call` to save gas
* use assembly `create` to also allow for contract creation
* forward tokens, so that one can batch-send tokens as well as Ether

# License

[GNU GPL](./LICENSE)
