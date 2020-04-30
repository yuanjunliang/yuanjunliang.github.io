# HDWallet分层确定性钱包

## 什么是数字钱包

数字钱包实际是一个管理私钥（生成、存储、签名）的工具

**注意**: 钱包并不保存资产，资产是在链上的

**私钥通过椭圆曲线生成公钥， 公钥通过哈希函数生成地址，这两个过程都是单向的。**

私钥和地址的关系如下：

![image.png](https://upload-images.jianshu.io/upload_images/266271-33d35720d4d017f5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 钱包的类型

私钥不同的生成方法，也对应着不同的钱包结构，通常可以分为`非确定性钱包`和`确定性钱包`。

### 什么是非确定性钱包

比特币最早的客户端（Satoshi client）就是非确定性钱包，钱包是一堆随机生成的私钥的集合。 客户端会预先生成 100 个随机私钥，并且每个私钥只使用一次。每个交易使用一个地址的概念是中本聪提出的。如果交易比较频繁，私钥可能会用光，然后再产生一批私钥，所以每次完成 100 个交易后，你必须备份新的 wallet.dat 文件，否则可能会丢失资产。这种钱包难以管理和备份。如果你生成很多私钥，你必须保存它们所有的副本。这就意味着这个钱包必须被经常性地备份。每个私钥都必须备份，否则一旦钱包不可访问时，无法找回钱包。

### 什么是确定性钱包

确定性钱包则不需要每次转账都要备份，确定性钱包的私钥是对种子进行单向哈希运算生成的，种子是一串由随机数生成器生成的随机数。在确定性钱包中，只要有这个种子，就可以找回所有私钥，只需备份种子就相当于备份您的所有钱包，所以这个种子也相当重要，一定要备份到安全的地方。

## 什么是HD钱包

HD 钱包是目前常用的确定性钱包 ，说到 HD 钱包，大家可能第一反应会想到硬件钱包 （Hardware Wallet），其实这里的 HD 是 Hierarchical Deterministic（分层确定性）的缩写。所谓分层，就是一个大公司可以为每个子部门分别生成不同的私钥，子部门还可以再管理子子部门的私钥，每个部门可以看到所有子部门里的币，也可以花这里面的币。也可以只给会计人员某个层级的公钥，让他可以看见这个部门及子部门的收支记录，但不能花里面的钱，使得财务管理更方便了。

## 如何创建账号

创建账号关键是生成一个私钥， 私钥是一个 32 个字节的数， `生成一个私钥在本质上在 1 到 2^256 之间选一个数字`。
因此生成密钥的第一步也是最重要的一步，是要找到足够安全的熵源，即随机性来源，只要选取的结果是不可预测或不可重复的，那么选取数字的具体方法并不重要。

比如可以掷硬币 256 次，用纸和笔记录正反面并转换为 0 和 1，随机得到的 256 位二进制数字可作为钱包的私钥。

从编程的角度来看，一般是通过在一个密码学安全的随机源(不建议大家自己去写一个随机数)中取出一长串随机字节，对其使用 SHA256 哈希算法进行运算，这样就可以方便地产生一个 256 位的数字。

> 实际过程需要比较下是否小于 n-1（n = 1.158 * 10^77, 略小于 2^256），我们就有了一个合适的私钥。否则，我们就用另一个随机数再重复一次。这样得到的私钥就可以根据上面的方法进一步生成公钥及地址。

## 分层确定性钱包的设计和实现

现如今 HD 钱包俨然已经成为事实上的行业标准，知道 HD 钱包的含义之后，我们来看看他的设计和实现。

HD 钱包的想法最早出现在比特币社区，而比特币社区里面提出新功能、流程、改进建议都有标准化的流程，发起者需要用文档的形式把内容书面化，提交给社区去讨论、论证，这种文档就叫做 `BIP（Bitcoin Improvement Proposal）`，比特币社区甚至连 BIP 本身该如何工作也写成了 BIP，定义 BIP 格式、工作流的的元 [BIP](https://github.com/bitcoin/bips/blob/master/bip-0002.mediawiki) 见这里，而和 HD 钱包紧密关联的几个 BIP 如下：

- [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki): HD 钱包的核心提案，说明了自私钥生成方法以及树壮结构的构造方式；
- [BIP43](https://github.com/bitcoin/bips/blob/master/bip-0043.mediawiki): 为 HD 钱包子私钥派生路径增加有广泛共识的段
- [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki): 确定支持多链 HD 钱包子私钥派生路径的标准格式


### BIP32

> 为了避免管理一堆私钥的麻烦提出的分层推导方案

钱包也是一个私钥的容器，按照上面的方法，我们可以生成一堆私钥（一个人也有很多账号的需求，可以更好保护隐私），而每个私钥都需要备份就特别麻烦的。

为了解决这种麻烦，就有了 BIP32 提议： 根据一个随机数种子通过分层确定性推导的方式得到 n 个私钥，这样保存的时候，只需要保存一个种子就可以，私钥可以推导出来，如图：

![image.png](https://upload-images.jianshu.io/upload_images/266271-55aa7bbc9e963c22.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


因此增加索引（水平扩展）及 通过子秘钥向下一层（深度扩展）可以无限生成私钥。

注意， 这个推导过程是确定（相同的输入，总是有相同的输出）也是单向的，子密钥不能推导出同层级的兄弟密钥，也不能推出父密钥。如果没有子链码也不能推导出孙密钥。现在我们已经对分层推导有了认识。

### BIP44

> 给 BIP32 的分层路径定义规范

通过这种分层（树状结构）推导出来的秘钥，通常用路径来表示，每个级别之间用斜杠 / 来表示，由主私钥衍生出的私钥起始以“m”打头。因此，第一个母密钥生成的子私钥是 m/0。第一个公共钥匙是 M/0。第一个子密钥的子密钥就是 m/0/1，以此类推。

BIP44 则是为这个路径约定了一个规范的含义(也扩展了对多币种的支持)，BIP0044 指定了包含 5 个预定义树状层级的结构：

```
m / purpose' / coin' / account' / change / address_index
```

m 是固定的， Purpose 也是固定的，值为 44（或者 0x8000002C）

- **Coin type**

这个代表的是币种，0 代表比特币，1 代表比特币测试链，60 代表以太坊
完整的币种列表地址：https://github.com/satoshilabs/slips/blob/master/slip-0044.md

- **Account**

代表这个币的账户索引，从 0 开始

- **Change**

常量 0 用于外部链，常量 1 用于内部链（也称为更改地址）。外部链用于在钱包外可见的地址（例如，用于接收付款）。内部链用于在钱包外部不可见的地址，用于返回交易变更。 (所以一般使用 0)

- **address_index**

这就是地址索引，从 0 开始，代表生成第几个地址，官方建议，每个 account 下的 address_index 不要超过 20

根据 [EIP85 提议的讨论](https://github.com/ethereum/EIPs/issues/85)以太坊钱包也遵循 BIP44 标准，确定路径是 `m/44'/60'/a'/0/n `
a 表示帐号，n 是第 n 生成的地址，60 是在 [SLIP44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) 提案中确定的以太坊的编码。所以我们要开发以太坊钱包同样需要对比特币的钱包提案 BIP32、BIP39 有所了解。


### BIP39

BIP32 提案可以让我们保存一个随机数种子（通常 16 进制数表示），而不是一堆秘钥，确实方便一些，不过用户使用起来(比如冷备份)也比较繁琐，这就出现了 [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)，它是使用助记词的方式，生成种子的，这样用户只需要记住 12（或 24）个单词，单词序列通过 PBKDF2 与 HMAC-SHA512 函数创建出随机种子作为 BIP32 的种子。

使用助记词作为种子其实包含 2 个部分：助记词生成及助记词推导出随机种子，下面分析下这个过程。

**1. 生成助记词**

助记词生成的过程是这样的：先生成一个 128 位随机数，再加上对随机数做的校验 4 位，得到 132 位的一个数，然后按每 11 位做切分，这样就有了 12 个二进制数，然后用每个数去查 [BIP39 定义的单词表](https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md)，这样就得到 12 个助记词，这个过程图示如下：

![image.png](https://upload-images.jianshu.io/upload_images/266271-0eb2b3eb16b3d39e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


**2. 助记词推导出种子**

这个过程使用密钥拉伸（Key stretching）函数，被用来增强弱密钥的安全性，PBKDF2 是常用的密钥拉伸算法中的一种。
PBKDF2 基本原理是通过一个为随机函数(例如 HMAC 函数)，把助记词明文和盐值作为输入参数，然后重复进行运算最终产生生成一个更长的（512 位）密钥种子。这个种子再构建一个确定性钱包并派生出它的密钥。

密钥拉伸函数需要两个参数：助记词和盐。盐可以提高暴力破解的难度。 盐由常量字符串 "mnemonic" 及一个可选的密码组成，注意使用不同密码，则拉伸函数在使用同一个助记词的情况下会产生一个不同的种子，这个过程图示图下：

![](https://img.learnblockchain.cn/2018/d37f78f8f2d859369d99fc5e0a76c184.png!wl/scale/80)

代码示例

```
var hdkey = require('ethereumjs-wallet/hdkey')
var util = require('ethereumjs-util')

var seed = bip39.mnemonicToSeed(mnemonic, "pwd");
var hdWallet = hdkey.fromMasterSeed(seed);

var key1 = hdWallet.derivePath("m/44'/60'/0'/0/0");
console.log("私钥："+util.bufferToHex(key1._hdkey._privateKey));

var address1 = util.pubToAddress(key1._hdkey._publicKey, true);
console.log("地址："+util.bufferToHex(address1));
console.log("校验和地址："+ util.toChecksumAddress(address1.toString('hex')));

```

校验和地址是 EIP-55 中定义的对大小写有要求的一种地址形式。

密码可以作为一个额外的安全因子来保护种子，即使助记词的备份被窃取，也可以保证钱包的安全（也要求密码拥有足够的复杂度和长度），不过另外一方面，如果我们忘记密码，那么将无法恢复我们的数字资产。

一句话概括下 BIP39 就是：`通过定义助记词让种子的备份更友好`

## 示例

生成以太坊的HDwallet

```
const Bip39 = require('bip39')
const Bip32 = require('bip32')
const HDKey = require('hdkey')

const createKey = () => {
    try {
        // 生成助记词
        let mnemonic = Bip39.generateMnemonic()
        let seed = Bip39.mnemonicToSeedSync(mnemonic)
        let hdkey = HDKey.fromMasterSeed(Buffer.from(seed,'hex'))

        // 根私钥
        let privateExtendedKey = hdkey.privateExtendedKey
        let privateKey = hdkey.privateKey.toString('hex')
        
        // console.log({privateExtendedKey,privateKey})

        // 生成以太坊路径的keyPair
        let childKey = hdkey.derive("m/44'/60'/0'/0/0")
        let ethPrivateKey = childKey._privateKey.toString('hex')
        let ethPublicKey = childKey._publicKey.toString('hex')
        console.log({ethPrivateKey,ethPublicKey,mnemonic})
    } catch (error) {
        console.log(error)
    }
}
```


## 参考文章

- [理解开发HD 钱包涉及的 BIP32、BIP44、BIP39](https://learnblockchain.cn/2018/09/28/hdwallet)
- [分层确定性钱包 HD Wallet 剖析：设计和实现](https://www.arcblock.io/zh/post/2018/12/01/hd-wallets-design-and-implementation)
- [分层确定性钱包 HD Wallet 介绍](https://zhuanlan.zhihu.com/p/30297080)
- [HDWallet 原理分析](https://learnblockchain.cn/article/784)
- [创建钱包时同时生成助记词](https://www.jianshu.com/p/02879235c084)