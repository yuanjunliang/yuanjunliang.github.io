# Solidity字符串

- 字符串不能通过`length`方法获取其长度，只能通过`bytes(str).length`方式获得

## 如何判断字符串传参是否为空

```
contract TestString {
    function setUserName(string memory _name) public {
        require(bytes(_name).length != 0, 'name can not be null');
    }
}
```


## 参考文章

- [Solidity字符串类型](https://www.cnblogs.com/flyingeagle/p/10138782.html)