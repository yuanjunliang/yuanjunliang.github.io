## 比特币与UTXO模型

UTXO全名是`Unspent Transaction Outputs`，未花费交易输出，相比于账户模型来说没那么直观。

在比特币的世界里，并没有一个纪录所有帐户余额的帐本。那么要怎么确定一个地址现在有多少余额呢？简单的说，你要回顾以前所有的交易，并且找到所有寄给你的比特币，再把他们全都加起来，才会知道。

## 交易中的输入与输出

比特币中的一笔「交易」也较为复杂。假设今天，Fred给了Alice 2个BTC，Ted给了Alice 3个BTC，我们把这两笔寄给Alice，总和为5的BTC称为`Unspent Transaction Outputs`即未花费交易输出：也就是说现在Alice拥有了两笔`Unspent Transcation Outputs`，可以当作他未来转钱给别人的`input`。

如果现在Alice想要转5 BTC给Bob，他要将前面两笔总和刚好为5的UTXO当作这笔交易的输入。而矿工要验证的就是并没有其他交易在先前的区块当中，已经使用过这笔`Unspent Output`。如果同一笔输出已经被发送过，那它就不是`Unspent`了，这就是比特币预防`Double Spending`的方法。

![image.png](https://upload-images.jianshu.io/upload_images/266271-a912b6d9cce94882.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

还有一个条件就是，`output`跟`input`总数要吻合。实际上在交易的时候，并不可能刚刚好总是找到两笔加起来等于你要转出金额的`output`，就好像上图中，如果爱丽丝Alice只想转4.5个BTC给鲍勃Bob，那么他就要多加一栏的`output`，把多出来的0.5个BTC转给自己，这样的交易才是平衡的。

我们可以实际来看看比特币的交易长什么样子，我们现在如果想要观察`BlockExplorer`上自己的交易纪录，会发现它长的是这付德性：

![image.png](https://upload-images.jianshu.io/upload_images/266271-825fbac3baa7a58f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

一笔交易包含了大量的`input`与`output`，这很有可能是一笔交易所转出金额的纪录，所以含有很多的output。而左边的input则可能是大量转入金额交易所钱包的交易output。

有趣的是，我们实际上在一笔交易之中无法「确定」真正的交易金额。例如下面这一笔纪录中，右边包含了三个`output`，我们无法确定究竟0.2,0.03以及56.38三个`output`究竟哪一个才是真正的目的地。搞不好Alice只有一笔`Unspent Transaction Output`未花费交易输出56.61 BTC，因此他在这笔交易中虽然他只想要转0.2BTC，却必须要动用他唯一一笔UTXO，而剩下的56.38再转回给自己。

![image.png](https://upload-images.jianshu.io/upload_images/266271-e9dc97bbf8be3cac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

当然，现在的比特币钱包已经帮我们照顾这些事情了，所以在使用的时候就好像银行帐户一样，我们只要输出目的地址，钱包就会帮我们找出合适的未花费输出（UTXO）当作输入来完成交易 。但如果你很闲，或是要干一些不想让你知道的事，就可以自己来打包奇怪的输入输出来增加匿名性。

## UTXO的优势与劣势

UTXO因为没有帐户的存在，因此容许平行进行多笔交易。假如你有许多的UTXOs，你可以同时进行多笔交易而不会被阻挡。再来就是匿名性，如上面提过得，你可以轻易的隐藏自己的交易目的。除此之外，UTXO也被认为比较安全且有效率，可以透过Simple Payment Verification（SPV）来快速验证检验交易。

但UTXO最大的缺点就在于他是`Stateless`无状态的，这对于在其上开发应用程序非常的不利。就像有名的Qtum虽然底子是UTXO的交易模式，但是仍然会设计`Account Abstraction Layer`账户抽象层来让应用程序的开发变得容易。


## 参考文章

- [比特币UTXO模型介绍](https://segmentfault.com/a/1190000016809872)