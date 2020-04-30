# Solidity映射(mapping)

映射类型定义方法

```
mapping(keyType => valueType) variableName;

// 读取映射的值
variableName[key];
// 给映射赋值
variableName[key] = value;
```

- `映射`或`字典`类型，一种键值对的映射关系存储结构,定义方式为`mapping(_KeyType => _KeyValue)`,键的类型允许除映射外的所有类型，如数组，合约，枚举，结构体。值的类型无限制。
- 映射可以被视作为一个`哈希表`，其中所有可能的键已被虚拟化的创建，被映射到一个`默认值`。但在映射表中，我们并不存储键的数据，仅仅存储它的`keccak256`哈希值，用来查找值时使用。
- 映射没有设置长度或键或值的概念，因此，如果没有有关已分配键的额外信息，则无法删除映射
- 因此，`映射`并没有长度，`键集合（或列表`），`值集合（或列表）`这样的概念。不能直接遍历`mapping`类型，需要通过其他手段
- `映射`只能具有的数据位置，`storage`因此可以用作状态变量，作为函数中的`存储引用类型`或作为`库函数的参数`。它们不能用作公开可见的合同功能的参数或返回参数
- `delete`对映射没有影响（因为映射的键可能是任意的，并且通常是未知的）。因此，如果删除一个结构，它将重置所有非映射成员，并且递归到这些成员中，除非它们是映射,但是，可以删除单个键及其映射的对象：如果a是映射，则将删除存储在的值。`delete a[x]x`

## 遍历映射

您无法遍历映射，即无法枚举其键。但是可以通过保存所有的`key`来遍历`mapping`。

例如:

```
pragma solidity >=0.5.6 <0.7.0;
pragma experimental ABIEncoderV2;

contract UserManger {
    struct User {
        uint age;
        string name;
        bool isSet;
    }
    
    mapping(uint => User) userMap;
    uint[] userAddressList;  // 保存mapping所有的key值，方便以后遍历mapping
    
    function addUsers (uint _userId,uint _age, string memory _name) public {
        require(userMap[_userId].isSet == false,'User added');
        require(bytes(_name).length != 0,'name can not null');
        userMap[_userId] = User(_age,_name,true);
        userAddressList.push(_userId);
    }
    
    function getUsers () public view returns(User[] memory) {
        uint length = userAddressList.length;
        User[] memory users = new User[](length);
        // 遍历mapping
        for(uint i = 0;i < length; i++) {
            uint userId = userAddressList[i];
            users[i] = userMap[userId];
        }
        return users;
    }
}
```