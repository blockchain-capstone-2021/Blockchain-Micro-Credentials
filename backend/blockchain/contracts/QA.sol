// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

contract QA
{
    string[] private _qa_array; 

    function addHash (string memory _qa_hash) public
    {
        _qa_array.push(_qa_hash);
    }

    function getLastIndex() public view returns (uint)
    {
        return (_qa_array.length - 1);
    }

    function getLength () public view returns (uint)
    {
        return _qa_array.length;
    }

    function returnHash (uint index) public view returns (string memory)
    {
        require(index >= 0 && index < _qa_array.length, "Index is out of Array Bounds");

        return _qa_array[index];
    }
}