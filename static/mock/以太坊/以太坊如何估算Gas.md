# 以太坊如何估算Gas

## 什么是Gas

`Gas`是交易发起人需要为以太坊区块链上的每项操作支付的执行费的名称。 `gas`这个名称的灵感来源于这种费用可以作为加密燃料，驱动智能合约的运动。 `gas`可以从执行代码的矿工那里购买。 由于`gas`单位与具有自然成本的计算单元对齐，因此`gas`和`ether`有意地解耦，而`ether（以太）`的价格通常是随市场波动的。 这两者是由自由市场调节的：`gas`的价格实际上是由矿工决定的，他们可以拒绝处理gas价格低于最低限额的交易。 你只需在你的账户中添加一定的以太币就可以获得`gas`。 以太坊客户端会自动为你的以太币购买`gas`，金额为您指定的金额，作为交易的最大支出。

根据以太坊协议，在合约或交易中执行的每个计算步骤都要收取费用，以防止在以太坊网络上的恶意攻击和滥用。每笔交易都必须包含`gas limit`和愿意为`gas`支付的费用。矿工可以选择是否打包交易和收取费用。
- 如果由交易产生的计算步骤所使用的gas总量(gas used )，包括原始消息和可能被触发的任何子消息，小于或等于gas limit，则处理该交易。
- 如果gas总量超过`gas limit`，那么所有的改变都会回退，除非交易仍然有效并且矿工接受了这个费用。交易执行中未使用的所有多余的`gas`将以`Ether`返还给交易发起人。你不必担心超支，因为你只需支付消耗的`gas`费用。这意味着发送高于估计值`gas limit`的交易是有用的，也是安全的。

## 估算交易成本

交易中花费的总共的ether成本取决于2个因素：
- `gasUsed`:是交易中消耗的总共的gas
- `gasPrice`：在交易中指定一个单位gas的价格（ether）

```
gas = gasUsed * gasPrice
```

### gasUsed

EVM中的每个操作都指定了要消耗的`gas`量。 `gasUsed`是执行所有操作的所有`gas`的总和。 有一个电子表格，提供了这背后的一些分析。以下两个`API`可以估算出`gasUsed`

- [methods.myMethod.estimateGas](https://web3js.readthedocs.io/en/v1.2.7/web3-eth-contract.html#methods-mymethod-estimategas)

估算合约方法执行所需要的`gasUsed`

```
myContract.methods.myMethod(123).estimateGas({gas: 5000000}, function(error, gasAmount){
    if(gasAmount == 5000000)
        console.log('Method ran out of gas');
});
```

- [estimateGas](https://web3js.readthedocs.io/en/v1.2.7/web3-eth.html#estimategas)

```
web3.eth.estimateGas({
    to: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
})
.then(console.log);
> "0x0000000000000000000000000000000000000000000000000000000000000015"
```

估算`data`数据(比如部署合约)执行所需要的`gasUsed`

### gasPrice

- [getGasPrice](https://web3js.readthedocs.io/en/v1.2.7/web3-eth.html#getgasprice)

```
web3.eth.getGasPrice([callback])
```

返回当前的`gasPrice`预言。天然气价格由最后几个区块的`gasPrice`中位数决定。
当前以`wei`为单位的`gasPrice`的数字字符串

### 示例

```
async getGasPrice () {
    try {
        let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/"))
        let gasPrice = await web3.eth.getGasPrice()  // Gwei
        let gasUsed = await web3.eth.estimateGas({  //  Gwei
            to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe'
        })
        let gas = gasUsed * gasPrice  // Gwei
        let gasLimit = gas * 2
        // 1 ether = 1e9 Gwei
        let ether = gas / 1e9
        console.log({gasUsed,gasPrice,gas,gasLimit,ether})
    } catch (error) {
        console.log(error)
    }
}
```

## 单位换算

```
1 Gwei  = 1,000,000,000 wei
1 Ether = 1,000,000,000 Gwei

交易费：
fee = gasUsed * gasPrice // Gwei
ether = fee / 1e9
```

## gas的查询网站

- [ethgasstation](https://ethgasstation.info/)

## 参考文章

- [以太坊（ETH）GAS详解](https://www.jianshu.com/p/4e912e5b1832)
- [以太坊概念与使用 wep3/infura 实现以太币及合约币交易流程](https://sanonz.github.io/2019/eth-transaction-for-wep3-and-infura/)