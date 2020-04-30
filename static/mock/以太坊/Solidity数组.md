# Solidity数组
[TOC]

- 在Solidity中，数组分为定长数组和变长数组
- 一个类型为T，长度为k的数组，可以声明为T[k]，而一个变长的数组则声明为T[]
- 对`storage`的数组来说，元素类型可以是任意的，类型可以是数组，映射类型，数据结构等
- 对`memory`的数组来说，如果函数是对外可见的，那么函数参数不能是映射类型的数组，只能是支持ABI的类型


## 动态数组
### 使用`new`创建动态数组

使用`new`关键字创建`memory`动态数组

```
pragma solidity >=0.4.16 <0.7.0;

contract C {
    function f() public pure {
        // 创建长度为7的动态内存数组a
        uint[] memory a = new uint[](7);
        // a数组不能使用.push方法添加元素
        // a.push(3);
        // a数组不能通过.length来改变数组长度
        // a.length = 10;
    }
}
```

与`storage`类型的数组相比较

1. 不能调整大小
2. 不能使用`.push`方法
3. 不能使用`.length`来修改数组长度
4. 要么必须预先计算所需的大小，要么创建一个新的内存阵列并复制每个元素
5. 不能将固定大小的`memory`数组赋值给动态大小的`memory`数组

eg: 

```
pragma solidity >=0.4.0 <0.7.0;

// This will not compile.
contract C {
    function f() public {
        // The next line creates a type error because uint[3] memory
        // cannot be converted to uint[] memory.
        // 不能直接将固定大小的数组赋值给动态大小的数组
        uint[] memory x = [uint(1), 3, 4];
    }
}
```


### 属性方法

- `length` :求数组长度
- `push()` : 可以在数组末尾添加一个零初始化的元素
- `push(x)` : 可以在数组末尾添加给定的元素`x`
- `pop` :从数组末尾删除一个元素

### 数组切片

截取数组`x`从`start`到`end`的一段数据

```
x[start:end]
```

- `end`最大为`x.length -1`
- 两个`start`和`end`是可选的：`start`默认为0与`end`默认为数组的长度。
- 如果`start`大于`end`或`end`大于数组的长度，则引发异常。

数组切片可用于ABI解码函数参数中传递的辅助数据：

```
pragma solidity >=0.6.0 <0.7.0;

contract Proxy {
    /// Address of the client contract managed by proxy i.e., this contract
    address client;

    constructor(address _client) public {
        client = _client;
    }

    /// Forward call to "setOwner(address)" that is implemented by client
    /// after doing basic validation on the address argument.
    function forward(bytes calldata _payload) external {
        bytes4 sig = abi.decode(_payload[:4], (bytes4));
        if (sig == bytes4(keccak256("setOwner(address)"))) {
            address owner = abi.decode(_payload[4:], (address));
            require(owner != address(0), "Address of owner cannot be zero.");
        }
        (bool status,) = client.delegatecall(_payload);
        require(status, "Forwarded call failed.");
    }
}
```

## memory数组的使用示例

```
pragma solidity >=0.5.6 <0.7.0;
// 返回数组或者结构体类型需要加这一句。在0.6.0以后的版本不再需要
pragma experimental ABIEncoderV2;

contract UserManger {
    struct User {
        uint age;
        string name;
        bool isSet;
    }
    
    mapping(uint => User) userMap;
    uint[] userAddressList;
    
    function addUsers (uint _userId,uint _age, string memory _name) public {
        require(userMap[_userId].isSet == false,'User added');
        require(bytes(_name).length != 0,'name can not null');
        userMap[_userId] = User(_age,_name,true);
        userAddressList.push(_userId);
    }
    
    function getUsers () public view returns(User[] memory) {
        uint length = userAddressList.length;
        // 定义临时数组变量
        User[] memory users = new User[](length);
        // 遍历mapping，存到临时数组中返回
        for(uint i = 0;i < length; i++) {
            uint userId = userAddressList[i];
            users[i] = userMap[userId];
        }
        return users;
    }
}
```

参考文章:

- [官方文档](https://solidity.readthedocs.io/en/v0.6.6/types.html#arrays)
- [Solidity的数组特性深入详解](https://me.tryblockchain.org/solidity-array.html)
- [数组](https://www.tryblockchain.org/Solidity-Array-%E6%95%B0%E7%BB%84.html)