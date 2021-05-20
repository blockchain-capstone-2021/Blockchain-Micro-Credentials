// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

contract Micro_Module {
    string[] private _module_array;
    
    //Add an ipfs hash to array
    function addHash(string memory _module_hash) public {
        _module_array.push(_module_hash);
    }

    //Get the index of that last hash added
    function getLastIndex() public view returns (uint256) {
        return (_module_array.length - 1);
    }

    //Get the length of the hash array
    function getLength() public view returns (uint256) {
        return _module_array.length;
    }   

    //Get the hash given a specifc
    function returnHash(uint256 index) public view returns (string memory) {
        require(index >= 0 && index < _module_array.length, "Index is out of Array Bounds");

        return _module_array[index];
    }
}
