const Web3 = require('web3')
const Batcher = require('./batcher');
const BN = require('bn.js')

let contract, dummyContract, tx, batcher
const web3 = new Web3('http://127.0.0.1:8545')
const contractInfo = require('./build.json')

async function setup() {
  const accounts = await web3.eth.getAccounts()
  web3.eth.defaultAccount = accounts[0]
  contract = await deployContract('Batcher.sol', 'TransactionBatcher')
  dummyContract = await deployContract('Dummy.sol', 'Dummy')
  batcher = new Batcher({
    contract: contract.options.address,
    web3
  })

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


test('batch some transactions using the batcher', async () => {
  await setup()

  // call foo()
  const tx0 = {
    data: dummyContract.methods.foo().encodeABI(),
    from: web3.eth.defaultAccount,
    to: dummyContract.options.address
  }

  // send some ETH to some contract
  const ethToSend = 1418
  const ethToSendTo = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'
  const tx1 = {
    from: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
    to: ethToSendTo,
    value: ethToSend
  }

  const balanceBefore = await web3.eth.getBalance(ethToSendTo)
  await batcher.sendTransaction([tx0, tx1])
  const balanceAfter = await web3.eth.getBalance(ethToSendTo)
  expect(new BN(balanceAfter).sub(new BN(balanceBefore)).toNumber()).toEqual(ethToSend)
});

test('fail if one of the transactions fails', async () => {
  await setup()

  // call foo()
  const tx0 = {
    data: dummyContract.methods.foo().encodeABI(),
    from: web3.eth.defaultAccount,
    to: dummyContract.options.address
  }
  // calways fail
  const tx1 = {
    data: dummyContract.methods.alwaysFail().encodeABI(),
    from: web3.eth.defaultAccount,
    to: dummyContract.options.address
  }

  expect(batcher.sendTransaction([tx0, tx1])).rejects.toThrow()
})

test('batcher.sendTransaction understands the calback function', async () => {
  async function waitUntilTrue(test, timeOut=1000) {
    return new Promise((resolve, reject) => {
      const timerId = setInterval(async () => {
        if (await test()) { return resolve(); }
      }, 30);
      setTimeout(() => { clearTimeout(timerId); return reject(new Error("Test timed out..")); }, timeOut);
    });
  }
  // call foo()
  const tx0 = {
    data: dummyContract.methods.foo().encodeABI(),
    from: web3.eth.defaultAccount,
    to: dummyContract.options.address
  }

  let txHash
  batcher.sendTransaction([tx0], (err, hash) => txHash = hash)
  await waitUntilTrue(() => !!txHash)
})

test.skip('create a contract [not implemented yet]', async () => {
  await setup()

  // deploy a contract
  const tx2 = {
    from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    data: "603d80600c6000396000f3007c01000000000000000000000000000000000000000000000000000000006000350463c6888fa18114602d57005b6007600435028060005260206000f3"
  }
  await batcher.sendTransaction([tx2])
})
