// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

contract Micro_Module
{
    string[] private _module_array; 

    function addHash (string memory _module_hash) public
    {
        _module_array.push(_module_hash);
    }

    function getLastIndex() public view returns (uint)
    {
        return (_module_array.length - 1);
    }

    function getLength () public view returns (uint)
    {
       return _module_array.length;
    }

    function returnHash (uint index) public view returns (string memory)
    {
        require(index >= 0 && index < _module_array.length, "Index is out of Array Bounds");

        return _module_array[index];
    }
}