const Web3 = require('web3')
const sum = require('./batcher');


function setup() {
  console.log(`deploying contract`)
  const web3 = new Web3('http://localhost:8545/')

}

test('adds 1 + 2 to equal 3', async () => {
  await setup()
  expect(sum(1, 2)).toBe(3);
});
