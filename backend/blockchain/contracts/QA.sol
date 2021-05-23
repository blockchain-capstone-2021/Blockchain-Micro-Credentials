// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

contract QA {
    string[] private _qa_array;

    //Add an ipfs hash to array
    function addHash(string memory _qa_hash) public {
        _qa_array.push(_qa_hash);
    }

    //Get the index of that last hash added
    function getLastIndex() public view returns (uint256) {
        return (_qa_array.length - 1);
    }

    //Get the length of the hash array
    function getLength() public view returns (uint256) {
        return _qa_array.length;
    }

    //Get the hash given a specifc
    function returnHash(uint256 index) public view returns (string memory) {
        require(index >= 0 && index < _qa_array.length, "Index is out of Array Bounds");

        return _qa_array[index];
    }
}
