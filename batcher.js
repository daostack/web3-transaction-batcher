const contractInfo = require('./build.json')

class Batcher {
  constructor(options = {}) {
    if (!options.contract) {
      throw Error(`Batcher must be instantiated with a contract address`)
    }
    if (!options.web3) {
      throw Error(`Batcher must be instantiated with a web3 instance`)
    }
    this.web3 = options.web3
    const contractABI = contractInfo.contracts['Batcher.sol']['TransactionBatcher'].abi
    const contractBytecode = contractInfo.contracts['Batcher.sol']['TransactionBatcher'].evm.bytecode.object
    this.contract = new this.web3.eth.Contract(contractABI, options.contract)
  }

  sendTransaction (transactions, callback) {
    const targets = []
    const values = []
    const datas = []
    let from
    let value = 0
    transactions.map((tx) => {
      // console.log(tx)
      targets.push(tx.to || '0x')
      values.push(tx.value || 0)
      value += tx.value || 0
      datas.push(tx.data || '0x')
      if (!from) {
        from = tx.from
      }
    })
    const tx = {
      data: this.contract.methods.batchSend(targets, values, datas).encodeABI(),
      to: this.contract.options.address,
      value
    }
    return this.web3.eth.sendTransaction(tx, callback)
  }
}
module.exports = Batcher;
