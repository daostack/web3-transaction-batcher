const solc = require('solc')
const fs = require('fs')

// const input = require('./contracts.json')


const CONTRACT_NAME = 'Batcher.sol'
const CONTRACT_FILE = `./contracts/${CONTRACT_NAME}`
const CONTRACT_NAME2 = 'Dummy.sol'
const CONTRACT_FILE2 = `./contracts/${CONTRACT_NAME2}`

const content = fs.readFileSync(CONTRACT_FILE).toString()
const content2 = fs.readFileSync(CONTRACT_FILE2).toString()

const input = {
  language: 'Solidity',
  sources: {
    [CONTRACT_NAME]: {
      content: content
    },
    [CONTRACT_NAME2]: {
      content: content2
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}
console.log(input)
const output = solc.compile(JSON.stringify(input))
console.log(output)

fs.writeFileSync(`./build.json`, output)
