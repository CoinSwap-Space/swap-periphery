const { deployer, routerConfig } = require('../secrets.json')
const { factory } = require('../../swap-core/config-factory.json')
const { DeployModel } = require('./deploy.model')

async function main(deployData) {

  if (!deployData)
    deployData = new DeployModel();

  const factoryAddress = factory
  const deployerAddress = deployer

  deployData.deployerAddress = deployer

  const CoinSwapRouter = await ethers.getContractFactory("CoinSwapRouter");

  const router = await CoinSwapRouter.deploy(factoryAddress, routerConfig.WBNBAddress);

  console.log("CoinSwapRouter deployed to:", router.address);

  deployData.router = router;

  console.log("CoinSwapRouter deployed by:", deployerAddress);
  console.log("CoinSwapRouter factory address:", factoryAddress);
  console.log("CoinSwapRouter WBNB address:", routerConfig.WBNBAddress);

  deployData.toJsonFile();

  await new Promise(resolve => setTimeout(resolve, 5000))

  const factoryAdd = await router.factory()
  const wbnb = await router.WBNB()

  console.log('fac', factoryAdd)
  console.log('wbnb', wbnb)

  return deployData;
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
