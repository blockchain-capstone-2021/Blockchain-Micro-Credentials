// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

contract Micro_Credential {
    string[] private _micro_credential_array;

    //Add an ipfs hash to array
    function addHash(string memory _micro_hash) public {
        _micro_credential_array.push(_micro_hash);
    }

    //Get the index of that last hash added
    function getLastIndex() public view returns (uint256) {
        return (_micro_credential_array.length - 1);
    }

    //Get the length of the hash array
    function getLength() public view returns (uint256) {
        return _micro_credential_array.length;
    }

    //Get the hash given a specifc
    function returnHash(uint256 index) public view returns (string memory) {
        require(index >= 0 && index < _micro_credential_array.length, "Index is out of Array Bounds");

        return _micro_credential_array[index];
    }
}
