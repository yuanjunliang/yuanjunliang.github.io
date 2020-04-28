# 以太坊中的nonce

为了防止交易重播，ETH（ETC）节点要求每笔交易必须有一个`nonce`数值。每一个账户从同一个节点发起交易时，这个`nonce`值从0开始计数，发送一笔`nonce`对应加1。当前面的`nonce`处理完成之后才会处理后面的`nonce`。注意这里的前提条件是相同的地址在相同的节点发送交易

## 以下是nonce使用的几条规则

- 当nonce太小（小于当前的nonce值），交易会被直接拒绝
- 当nonce太大，大于当前nonce，交易会一直处于队列之中
- 当发送一个比较大的nonce值，然后补齐开始nonce到那个值之间的nonce，那么交易依旧可以被执行
- 交易队列只保存最多64个从同一个账户发出的交易
- 当某节点queue中还有交易，但此时停止geth客户端，queue中的交易会被清除掉
- 当前nonce合适，但是账户余额不足时，会被以太坊拒绝
- 如果发起一笔交易，但是因为gwei比较低或者网络比较忙的时候，该交易还没矿工挖出，可以通过使用相同的nonce和较高的gas费用，从而“覆盖”前一笔交易

## 获取nonce值

- 思路一

第一个思路就是由业务系统维护nonce值的递增。如果交易发送就出现问题，那么该地址下一笔交易继续使用这个nonce进行发送交易

- 思路二

第二个思路就是使用现有的api查询当前地址已经发送交易的nonce值，然后对其加1，再发送交易。对应的API接口为：`eth_getTransactionCount`，此方法由两个参数，第一个参数为需要查询`nonce`的地址，第二个参数为block的状态：`latest`、`earliest`和`pending`。一般情况使用pending就可以查询获得最新已使用的nonce


示例

```
async transfer () {
    try {
        let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/"))
        let privateKey = Buffer.from("","hex")
        let from = "0xA25e7dCdfC50f1598Fc973C86A61179D74a012E2"

        let chainId = await web3.eth.getChainId()
        let txcount = await web3.eth.getTransactionCount(from)
        let nonce = web3.utils.numberToHex(txcount)
        
        let params = {
            from: from,
            to: "0x185A90160e604f8aAd4C9520660b9106A532A899",
            value: web3.utils.numberToHex(0.01 * 1e18),
            gasLimit: web3.utils.numberToHex(6721975),
            gasPrice: web3.utils.numberToHex(20000000000),
            nonce: nonce,
            chainId: chainId,
            data: "0x"
        }

        let tx = new Tx(params)
        tx.sign(privateKey)
        let serializedTx = tx.serialize();
        let result = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}
```

## Solidity中通过nonce防止重放攻击的示例

- [Micropayment Channel](https://solidity.readthedocs.io/en/v0.6.6/solidity-by-example.html#micropayment-channel)

## 参考文章

- [以太坊实战之《如何正确处理nonce》](https://blog.csdn.net/wo541075754/article/details/78081478)
- [以太坊入门（一）账户和nonce的关系](https://www.jianshu.com/p/d6dc974d9748)