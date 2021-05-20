// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

//The below code was adapted from the Solidity Iterable Mappring Documentation:
//      https://docs.soliditylang.org/en/v0.8.3/types.html
//The below allows the creation of a map and another array to track whether a particular element exists in the map

struct IndexValue { uint keyIndex; uint value; }
struct KeyFlag { string key; bool deleted; }

struct itmap {
    mapping(string => IndexValue) data;
    KeyFlag[] keys;
    uint size;
}

library IterableMapping {
    
    //Inserting a new element into the map and adding the key array
    function insert(itmap storage self, string memory key, uint value) internal returns (bool replaced) {
        uint keyIndex = self.data[key].keyIndex;
        self.data[key].value = value;
        if (keyIndex > 0)
            return true;
        else {
            keyIndex = self.keys.length;
            self.keys.push();
            self.data[key].keyIndex = keyIndex + 1;
            self.keys[keyIndex].key = key;
            self.size++;
            return false;
        }
    }

    //Check whether a key exists
    function contains(itmap storage self, string memory key) internal view returns (bool) {
        return self.data[key].keyIndex > 0;
    }

    //Returning the value of a element from the map
    function get(itmap storage self, string memory key) internal view returns (uint value) {
        value = self.data[key].value;
    }
}