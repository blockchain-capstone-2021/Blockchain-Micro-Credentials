const { models } = require('../models/index');

//return a module for a given moduleId
async function getModule(moduleId) {
    let _module;

    await models.Module.findByPk(moduleId).then(module => {
        _module = module;
    });
    return _module;
}

//return all modules for a given unitId
async function getModulesByUnit(unitId) {
    let _modules;

    await models.Module.findAll({
        where: {
            unitId: unitId
        }
    }).then(modules => {
        _modules = modules;
    });

    return _modules;
}

//updates number of questions to display to a student for a given module
async function updateNoOfQuestions(moduleId, noOfQuestions) {
    await models.Module.update({ noOfQuestions: noOfQuestions }, {
        where: {
            moduleId: moduleId
        }
    });
}

//updates state (published or unpublished) for a given module
async function updateModuleState(moduleId, publish) {
    await models.Module.update({ published: publish }, {
        where: {
            moduleId: moduleId
        }
    });
}

module.exports = {
    getModule,
    getModulesByUnit,
    updateNoOfQuestions,
    updateModuleState
};