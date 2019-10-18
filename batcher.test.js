const Web3 = require('web3')
const sum = require('./batcher');


async function setup() {
  console.log(`deploying contract`)
  const web3 = new Web3('http://localhost:8545/')
  web3.eth.defaultAccount = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
  const contractInfo = require('./build.json')
  const contractABI = contractInfo.contracts['Batcher.sol']['TransactionBatcher'].abi
  const contractBytecode = contractInfo.contracts['Batcher.sol']['TransactionBatcher'].evm.bytecode.object
  const contract = new web3.eth.Contract(contractABI)
  const deployedContract = await contract.deploy({
    data: contractBytecode}).send({
      from: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      gas: 1500000,
      gasPrice: '30000000000000'})
}

test('adds 1 + 2 to equal 3', async () => {
  await setup()
  expect(sum(1, 2)).toBe(3);
});
