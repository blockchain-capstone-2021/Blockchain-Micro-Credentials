// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

contract Micro_Credential
{
    string[] private _micro_credential_array; 

    function addHash (string memory _micro_hash) public
    {
        _micro_credential_array.push(_micro_hash);
    }

    function getLastIndex() public view returns (uint)
    {
        return (_micro_credential_array.length - 1);
    }

    function getLength () public view returns (uint)
    {
        return _micro_credential_array.length;
    }

    function returnHash (uint index) public view returns (string memory)
    {
        require(index >= 0 && index < _micro_credential_array.length, "Index is out of Array Bounds");

        return _micro_credential_array[index];
    }
}