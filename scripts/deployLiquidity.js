const { deployer, pairs } = require('../secrets.json')
const { router } = require('../config-router.json')
const { cssToken } = require('../../farm-master/config-farm-master.json')
const moment = require('moment')
const { BigNumber } =  require('@ethersproject/bignumber')

async function deployLiquidity() {

  const deployerAddress = deployer

  const CoinSwapRouter = await ethers.getContractFactory("CoinSwapRouter");

  const routerContract = await CoinSwapRouter.attach(router);

  const factoryAdd = await routerContract.factory()

  console.log('fac', factoryAdd)
  console.log('Router contract at:', routerContract.address)
  for (const p of pairs) {
    await addLiqudityForPair(routerContract, deployerAddress, p)
  }

}

async function addLiqudityForPair(routerContract, deployer, pairInfo) {
  if (pairInfo.symbol.includes('CSS')) {
    pairInfo.token1 = cssToken
  }
  if (pairInfo.symbol.includes('BNB')) {
    await addLiqudityForPairBNB(routerContract, deployer, pairInfo)
  } else {
    await addLiqudityForPairNotBNB(routerContract, deployer, pairInfo)
  }
}

async function addLiqudityForPairBNB(routerContract, deployer, pairInfo) {
  console.log(moment(moment.now()).add(1200, 'seconds').unix())

  const BEP20 = await ethers.getContractAt("IBEP20", pairInfo.token1);
  const bepContract = await BEP20.attach(pairInfo.token1);
  const approve = await bepContract.approve(deployer, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")

  console.log('Router address:', routerContract.address)
  console.log('Factory address:', routerContract.factory())
  console.log("Approved", pairInfo.symbol, approve)
  console.log('Adding liquidity for BNB pair:', pairInfo.symbol);
  await routerContract.addLiquidityBNB(bepContract.address, '100000000000000000','100000000000000000', '100000000000000000', deployer, moment(moment.now()).add(1200, 'seconds').unix(), {value: BigNumber.from('100000000000000000')}).then((res) => {
    console.log('Adding liquidity response:', res);
  }, (error) => console.error(error))
}
async function addLiqudityForPairNotBNB(routerContract, deployer, pairInfo) {
  console.log('Adding liquidity for non-BNB pair:', pairInfo.symbol);

}


deployLiquidity()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });