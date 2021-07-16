import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { abi as UNISWAP_V2_ROUTER_ABI } from '@uniswap/v2-periphery/build/UniswapV2Router02.json';
import { ethers } from 'hardhat';

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer, governor } = await hre.getNamedAccounts();

  const UNISWAP_V2_ROUTER = '0x7a250d5630b4cf539739df2c5dacb4c659f2488d';
  const uniswap = await ethers.getContractAt(UNISWAP_V2_ROUTER_ABI, '0x7a250d5630b4cf539739df2c5dacb4c659f2488d');
  const tradeFactory = await hre.deployments.get('TradeFactory');
  const WETH = await uniswap.WETH();

  await hre.deployments.deploy('UniswapV2Swapper', {
    contract: 'contracts/swappers/UniswapV2Swapper.sol:UniswapV2Swapper',
    from: deployer,
    args: [governor, tradeFactory.address, WETH, UNISWAP_V2_ROUTER],
    log: true,
  });
};
export default deployFunction;
deployFunction.dependencies = ['SwapperRegistry', 'TradeFactory'];
deployFunction.tags = ['UniswapV2Swapper'];