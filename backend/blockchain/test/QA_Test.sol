// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/QA.sol";
import "../contracts/QA_Tracker.sol";

contract QA_Test {
    QA qa = QA(DeployedAddresses.QA());

    QA_Tracker qa_tracker = QA_Tracker(DeployedAddresses.QA_Tracker());

    uint expectedSecondLength = 2;

    uint expectedFirstLength = 1;

    uint expectedSecondIndex = 1;

    uint expectedFirstIndex = 0;

    string expectedSecondKey = "This is the expected key";

    string expectedFirstKey = "This is a test key";

    string expectedSecondString = "This is a test string";

    string expectedFirstString = "This is a sample string";

    //Test whether a hash is being added correctly:
    //  -- The size of the tracker should be correct 
    //  -- The index being added to the tracker should be correct
    function testAddHash() public {
        qa.addHash(expectedFirstString);

        uint returnedIndex = qa.getLastIndex();

        qa_tracker.addTracker(expectedFirstKey, returnedIndex);

        uint size = qa_tracker.getLength();

        Assert.equal(size, expectedFirstLength, "Expected size should match the size that is returned.");

        Assert.equal(returnedIndex, expectedFirstIndex, "Expected Index should match the index that is returned.");
    }

    //Test whether a second hash is being added correctly:
    //  -- The size of the tracker should be correct 
    //  -- The index being added to the tracker should be correct
    function testAddSecondHash() public {
        qa.addHash(expectedSecondString);

        uint returnedIndex = qa.getLastIndex();

        qa_tracker.addTracker(expectedSecondKey, returnedIndex);

        uint size = qa_tracker.getLength();

        Assert.equal(size, expectedSecondLength, "Expected size should match the size that is returned.");

        Assert.equal(returnedIndex, expectedSecondIndex, "Expected Index should match the index that is returned.");
    }

    //Test whether the length of the hash array is correct
    function  testLength() public {
        uint returnedLength = qa.getLength();

        Assert.equal(returnedLength, expectedSecondLength, "Expected length should match the length that is returned.");
    }

    //Test whether the first hash being returned is correct
    function testReturnFirstHash() public {
        uint returnedIndex = qa_tracker.returnIndex(expectedFirstKey);

        string memory returnedHash = qa.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedFirstString, "Expected string should match the string that is returned.");
    }   

    //Test whether the second hash being returned is correct
    function testReturnSecondHash() public {
        uint returnedIndex = qa_tracker.returnIndex(expectedSecondKey);

        string memory returnedHash = qa.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedSecondString, "Expected string should match the string that is returned.");
    }

    //Test whether the a particular key exists
    function testExists() public {
        bool exists = qa_tracker.checkExists(expectedFirstKey);

        Assert.equal(exists, true, "Expected state of existence should match the state of existence that is returned.");
    }

    //Test whether a particular key does not exist
    function testNotExist() public {
        bool exists = qa_tracker.checkExists("does not exist");

        Assert.equal(exists, false, "Expected state of existence should match the state of existence that is returned.");
    }

    //Test whether the tracked index for a key is changeable, and whether the returned hash is then correct.
    function testUpdateValue() public {
        qa_tracker.addTracker(expectedSecondKey, expectedFirstIndex);

        uint returnedIndex = qa_tracker.returnIndex(expectedSecondKey);

        Assert.equal(returnedIndex, expectedFirstIndex, "Expected index should match the index that is returned.");

        string memory returnedHash = qa.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedFirstString, "Expected string should match the string that is returned.");
    }
}



