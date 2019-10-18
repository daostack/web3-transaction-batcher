const solc = require('solc')
const fs = require('fs')

// const input = require('./contracts.json')


const CONTRACT_NAME = 'Batcher.sol'
const CONTRACT_FILE = `./contracts/${CONTRACT_NAME}`

const content = fs.readFileSync(CONTRACT_FILE).toString()

const input = {
  language: 'Solidity',
  sources: {
    [CONTRACT_NAME]: {
      content: content
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
