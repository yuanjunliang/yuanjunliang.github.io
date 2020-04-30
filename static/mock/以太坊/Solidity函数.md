# Solidity函数
[TOC]

## 函数

- 可以将一个函数赋值给一个变量，一个函数类型的变量。
- 还可以将一个函数作为参数进行传递。
- 也可以在函数调用中返回一个函数。

函数类型有两类：`内部(internal)`和`外部(external)`函数

- **内部(internal)函数**只能在当前合约内被调用（在当前的代码块内，包括内部库函数，和继承的函数中）。
- **外部(external)函数**由地址和函数方法签名两部分组成，可作为外部函数调用的参数，或返回值。

函数类型定义如下

```
function (<parameter types>) {internal|external} [pure|constant|view|payable] [returns (<return types>)]
```

- 如果函数不需要返回，则省去 `returns ()`
- 函数类型默认是 `internal`， 因此 `internal` 可以省去。但以此相反，合约中函数本身默认是 `public` 的， 仅仅是当作类型名使用时默认是 `internal` 的。
- 有两个方式调用函数，一种是直接用函数名 `f()`, 一种是 `this.f()`， 前者用于`内部函数`，后者用于`外部函数`。
- 如果一个函数变量没有初始化，直接调用它将会产生异常。如果`delete`了一个函数后调用，也会发生同样的异常。

## 函数调用

- 内部调用`f()`

```
pragma solidity >=0.4.22 <0.7.0;

contract C {
    function g(uint a) public pure returns (uint ret) { return a + f(); }
    function f() internal pure returns (uint ret) { return g(7) + f(); }
}
```

- 外部调用`this.f()`或`c.f()`,`c`为实例化的合约

```
pragma solidity >=0.6.2 <0.7.0;

contract InfoFeed {
    function info() public payable returns (uint ret) { return 42; }
}

contract Consumer {
    InfoFeed feed;
    function setFeed(InfoFeed addr) public { feed = addr; }
    function callFeed() public { feed.info{value: 10, gas: 800}(); }
}
```

### 函数可见性

```
function (<parameter types>) {internal|external|public|private} [pure|view|payable] [returns (<return types>)]
```

- `external`

外部功能是合同接口的一部分，其他合同或通过交易调用它们。外部函数f不能在内部调用（即`f()`不起作用，但`this.f()`可以起作用）。当外部函数接收大量数据时，它们有时会更有效率，因为数据不会从调用数据复制到内存中。

- `public`

公共功能是合同接口的一部分，可以在内部或通过消息进行调用

- `internal`

这些函数和状态变量只能在内部（即，从当前合同内部或从其衍生的合同内部）访问，而无需使用`this`

- `private`

私有功能和状态变量仅对于在定义的合同中可见，而在派生合同中不可见。

### 状态变量的可读性

- `pure` 

纯函数，保证不会读取和修改状态变量

- `view` 

查看函数，只能读取，不能修改状态变量

- `payable`

接收以太坊转账

## 函数修饰符

`修改器(Modifiers)`可以用来轻易的改变一个函数的行为。比如用于在函数执行前检查某种前置条件。修改器是一种合约属性，可被继承，同时还可被派生的合约`重写(override)`,但前提是必须将它们标记为`virtual`,下面我们来看一段示例代码

```
pragma solidity >=0.5.0 <0.7.0;

contract owned {
    constructor() public { owner = msg.sender; }
    address payable owner;

    // This contract only defines a modifier but does not use
    // it: it will be used in derived contracts.
    // The function body is inserted where the special symbol
    // `_;` in the definition of a modifier appears.
    // This means that if the owner calls this function, the
    // function is executed and otherwise, an exception is
    // thrown.
    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }
}

contract destructible is owned {
    // This contract inherits the `onlyOwner` modifier from
    // `owned` and applies it to the `destroy` function, which
    // causes that calls to `destroy` only have an effect if
    // they are made by the stored owner.
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
}

contract priced {
    // Modifiers can receive arguments:
    modifier costs(uint price) {
        if (msg.value >= price) {
            _;
        }
    }
}

contract Register is priced, destructible {
    mapping (address => bool) registeredAddresses;
    uint price;

    constructor(uint initialPrice) public { price = initialPrice; }

    // It is important to also provide the
    // `payable` keyword here, otherwise the function will
    // automatically reject all Ether sent to it.
    function register() public payable costs(price) {
        registeredAddresses[msg.sender] = true;
    }

    function changePrice(uint _price) public onlyOwner {
        price = _price;
    }
}
```

- 修改器可以被继承，使用将 `modifier` 置于参数后，返回值前即可。
- 特殊`_`表示使用修改符的函数体的替换位置
- 从合约`Register`可以看出合约可以多继承，通过`,`号分隔两个被继承的对象。
- 修改器也是可以接收参数的，如`priced`的`costs`。

使用修改器实现的一个防重复进入的例子

```
pragma solidity >=0.5.0 <0.7.0;
contract Mutex {
    bool locked;
    // 通过modifier实现防止重复进入
    modifier noReentrancy() {
        require(
            !locked,
            "Reentrant call."
        );
        locked = true;
        _;
        locked = false;
    }

    /// This function is protected by a mutex, which means that
    /// reentrant calls from within `msg.sender.call` cannot call `f` again.
    /// The `return 7` statement assigns 7 to the return value but still
    /// executes the statement `locked = false` in the modifier.
    function f() public noReentrancy returns (uint) {
        (bool success,) = msg.sender.call("");
        require(success);
        return 7;
    }
}
```

例子中，由于`call()`方法有可能会调回当前方法，修改器实现了防重入的检查。

- 如果同一个函数有多个修改器，他们之间以空格隔开，修饰器会依次检查执行。
- 在修改器中和函数体内的显式的`return`语句，仅仅跳出当前的修改器和函数体。返回的变量会被赋值，但整个执行逻辑会在前一个修改器后面定义的`_`后继续执行。
- 修改器的参数可以是任意表达式。在对应的上下文中，所有的函数中引入的符号，在修改器中均可见。但修改器中引入的符号在函数中不可见，因为它们有可能被重写。

## 函数的重载

合同可以具有相同名称但具有不同参数类型的多个功能。此过程称为`“重载”`，并且也适用于继承的函数。以下示例显示了`f`合同范围内功能的重载`A`

```
pragma solidity >=0.4.16 <0.7.0;

contract A {
    function f(uint _in) public pure returns (uint out) {
        out = _in;
    }

    function f(uint _in, bool _really) public pure returns (uint out) {
        if (_really)
            out = _in;
    }
}
```

- 通过将当前作用域中的函数声明与函数调用中提供的参数进行匹配，可以选择重载的函数。
- 如果所有参数都可以隐式转换为期望的类型，则选择函数作为重载候选。
- 如果没有确切的候选人，则解决方案将失败。

例如

```
pragma solidity >=0.4.16 <0.7.0;

contract A {
    function f(uint8 _in) public pure returns (uint8 out) {
        out = _in;
    }

    function f(uint256 _in) public pure returns (uint256 out) {
        out = _in;
    }
}
```

调用`f(50)`会产生类型错误，因为`50`可以隐式转换为`uint8` 和`uint256`类型。另一方面`f(256)`，`f(uint256)`由于`256`无法隐式转换为，因此将解决重载问题`uint8`

## 参数的解构

```
pragma solidity >=0.5.0 <0.7.0;

contract C {
    uint index;

    function f() public pure returns (uint, bool, uint) {
        return (7, true, 2);
    }

    function g() public {
        // Variables declared with type and assigned from the returned tuple,
        // not all elements have to be specified (but the number must match).
        (uint x, , uint y) = f();
        // Common trick to swap values -- does not work for non-value storage types.
        (x, y) = (y, x);
        // Components can be left out (also for variable declarations).
        (index, , ) = f(); // Sets the index to 7
    }
}
```

不可能混合使用变量声明和非声明分配，即以下无效： `(x, uint y) = (1, 2);`


### 特殊函数

-  `receive()`函数

```
receive() external payable {}
```

该函数不能有参数，不能返回任何东西，并且必须具有 可见性和状态可变性

- `fallback()`函数

```
fallback() external payable {}
```

该函数不能有参数，不能返回任何东西，并且必须具有可见性。如果没有其他功能与给定的功能签名相匹配，或者根本没有提供任何数据并且没有`receive()`函数，则在调用合同时执行该操作

### 参数/返回值中有复杂类型

- 如果函数不需要返回，则省去 `returns ()`
- 一个外部函数不能接受一个多维阵列作为输入参数。如果`ABIEncoderV2`通过添加到源文件来启用新功能，则此功能是可能的 。`pragma experimental ABIEncoderV2;`
- 内部功能可以接受的多维阵列，而无需启用该功能。
- `mapping`即使启用了该功能也无法作为返回项