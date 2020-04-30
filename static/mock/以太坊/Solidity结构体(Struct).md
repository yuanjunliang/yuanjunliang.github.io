# Solidity结构体

`Solidity`提供`struct`来定义自定义类型,我们来看看下面的例子

```
pragma solidity >=0.6.0 <0.7.0;

// Defines a new type with two fields.
// Declaring a struct outside of a contract allows
// it to be shared by multiple contracts.
// Here, this is not really needed.
struct Funder {
    address addr;
    uint amount;
}

contract CrowdFunding {
    // Structs can also be defined inside contracts, which makes them
    // visible only there and in derived contracts.
    struct Campaign {
        address payable beneficiary;
        uint fundingGoal;
        uint numFunders;
        uint amount;
        mapping (uint => Funder) funders;
    }

    uint numCampaigns;
    mapping (uint => Campaign) campaigns;

    function newCampaign(address payable beneficiary, uint goal) public returns (uint campaignID) {
        campaignID = numCampaigns++; // campaignID is return variable
        // Creates new struct in memory and copies it to storage.
        // We leave out the mapping type, because it is not valid in memory.
        // If structs are copied (even from storage to storage),
        // types that are not valid outside of storage (ex. mappings and array of mappings)
        // are always omitted, because they cannot be enumerated.
        campaigns[campaignID] = Campaign(beneficiary, goal, 0, 0);
    }

    function contribute(uint campaignID) public payable {
        Campaign storage c = campaigns[campaignID];
        // Creates a new temporary memory struct, initialised with the given values
        // and copies it over to storage.
        // Note that you can also use Funder(msg.sender, msg.value) to initialise.
        c.funders[c.numFunders++] = Funder({addr: msg.sender, amount: msg.value});
        c.amount += msg.value;
    }

    function checkGoalReached(uint campaignID) public returns (bool reached) {
        Campaign storage c = campaigns[campaignID];
        if (c.amount < c.fundingGoal)
            return false;
        uint amount = c.amount;
        c.amount = 0;
        c.beneficiary.transfer(amount);
        return true;
    }
}
```

该合约未提供众筹合约的全部功能，但包含理解结构所必需的基本概念。结构类型可以在映射和数组内部使用，它们本身可以包含映射和数组

- 结构类型可以在`映射(mapping)`和`数组`内部使用，它们本身可以包含映射和数组
- 我们不能声明一个`struct`同时将这个`struct`作为这个`struct`的一个成员。这个限制是基于结构体的大小必须是有限的。
- 需要注意的是在函数中，将一个`struct`赋值给一个局部变量（默认是`storage`类型），实际是拷贝的引用，所以修改局部变量值时，会影响到原变量。 

当然，你也可以直接通过访问成员修改值，而不用一定赋值给一个局部变量
例如:

```
campaigns[comapingnId].amount = 0
```