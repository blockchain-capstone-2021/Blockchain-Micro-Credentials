// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

import "./IterableMapping.sol";

contract QA_Tracker
{
    itmap private _trackers;

    using IterableMapping for itmap;

    function addTracker(string memory key, uint index) public
    {
        _trackers.insert(key, index);
    }

    function getLength () public view returns (uint)
    {
        return _trackers.size;
    }

    function checkExists(string memory key) public view returns (bool)
    {
        return _trackers.contains(key);
    }

    function returnIndex (string memory key) public view returns (uint)
    {
        return _trackers.get(key);
    }
}