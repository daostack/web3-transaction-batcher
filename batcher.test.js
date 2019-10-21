const Web3 = require('web3')
const sum = require('./batcher');

let contract, dummyContract
const web3 = new Web3('http://localhost:8545/')
const contractInfo = require('./build.json')

async function setup() {
  web3.eth.defaultAccount = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
  contract = await deployContract('Batcher.sol', 'TransactionBatcher')
  dummyContract = await deployContract('Dummy.sol', 'Dummy')
}
async function deployContract(filename, name) {

  const contractABI = contractInfo.contracts[filename][name].abi
  const contractBytecode = contractInfo.contracts[filename][name].evm.bytecode.object
  const contractToDeploy = new web3.eth.Contract(contractABI)
  const deployedContract = await contractToDeploy.deploy({
    data: contractBytecode}).send({
      from: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      gas: 1500000,
      gasPrice: '300000000000'})
  return deployedContract

}

test('send some transactions directly to the contract', async () => {
  await setup()
  let tx

  // send a single transaction
  tx = await contract.methods.batchSend([dummyContract.options.address], [0], [dummyContract.methods.foo().encodeABI()]).send({from: web3.eth.defaultAccount})
  expect(Object.keys(tx.events).length).toEqual(1)

  // send two transactions
  tx = await contract.methods.batchSend(
    [dummyContract.options.address, dummyContract.options.address],
    [0, 0],
    [dummyContract.methods.foo().encodeABI(), dummyContract.methods.bar().encodeABI()]
  ).send({from: web3.eth.defaultAccount})
  expect(Object.keys(tx.events).length).toEqual(2)
});
