const { exec } =  require('child_process');
const { router } = require('../config-router.json')
const { routerConfig } = require('../secrets.json')
const { factory } = require('../../swap-core/config-factory.json')
/**
 * Execute simple shell command (async wrapper).
 * @param {String} cmd
 * @return {Object} { stdout: String, stderr: String }
 */
async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function verifyRouter() {
  let { stdout } = await sh(`npx hardhat verify ${router} ${factory} ${routerConfig.WBNBAddress} --network testnet`);
  for (let line of stdout.split('\n')) {
    console.log(`${line}`);
  }
}

verifyRouter()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
