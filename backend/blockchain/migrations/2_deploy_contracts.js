var IterableMapping = artifacts.require("IterableMapping")
var Manual_Entry_Tracker = artifacts.require("Manual_Entry_Tracker")
var Manual_Entry = artifacts.require("Manual_Entry")
var Micro_Credential_Tracker = artifacts.require("Micro_Credential_Tracker")
var Micro_Credential = artifacts.require("Micro_Credential")
var Micro_Module_Tracker = artifacts.require("Micro_Module_Tracker")
var Micro_Module = artifacts.require("Micro_Module")
var QA_Tracker = artifacts.require("QA_Tracker")
var QA = artifacts.require("QA");
var Unit_Tracker = artifacts.require("Unit_Tracker")
var Unit = artifacts.require("Unit")

module.exports = function(deployer) {
    deployer.deploy(IterableMapping);
    deployer.deploy(Manual_Entry_Tracker);
    deployer.deploy(Manual_Entry);
    deployer.deploy(Micro_Credential_Tracker);
    deployer.deploy(Micro_Credential);
    deployer.deploy(Micro_Module_Tracker);
    deployer.deploy(Micro_Module);
    deployer.deploy(QA_Tracker)
    deployer.deploy(QA);
    deployer.deploy(Unit_Tracker);
    deployer.deploy(Unit);
};