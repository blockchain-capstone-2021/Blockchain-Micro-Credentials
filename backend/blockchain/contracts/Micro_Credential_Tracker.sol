// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

import "./IterableMapping.sol";

contract Micro_Credential_Tracker {
    itmap private _trackers;

    using IterableMapping for itmap;

    //Add a tracker for a index of the micro-credential array
    function addTracker(string memory key, uint256 index) public {
        _trackers.insert(key, index);
    }

    //Get the length of the trackers array
    function getLength() public view returns (uint256) {
        return _trackers.size;
    }

    //Check whether a particular key exists
    function checkExists(string memory key) public view returns (bool) {
        return _trackers.contains(key);
    }

    //Get the index being tracked for a particular key
    function returnIndex(string memory key) public view returns (uint256) {
        return _trackers.get(key);
    }
}
