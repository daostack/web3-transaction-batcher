pragma solidity 0.5.12;

contract Dummy {
  event FunctionCalled(address sender);

  function foo() public {
    emit FunctionCalled(msg.sender);
  }

  function bar() public {
    emit FunctionCalled(0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1);
  }

  function alwaysFail() pure public {
    revert('this transaction always fails');
  }


}
