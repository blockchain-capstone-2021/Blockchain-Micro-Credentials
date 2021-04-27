const { models } = require('../models/index')

//return a module for a given moduleId
async function getModule(_moduleId) 
{
    let _module;

    await models.Module.findByPk(_moduleId).then( module => {
        _module = module;
    });

    return _module;
}

//return all modules for a given unitId
async function getModulesByUnit (_unitId) 
{
    let _modules;

    await models.Module.findAll({
        where: {
          unitId: _unitId
        }
      }).then( modules => {
        _modules = modules;
    });
  
    return _modules;
}

//updates number of questions to display to a student for a given module
async function updateNoOfQuestions(_moduleId, _noOfQuestions)
{
    await models.Module.update({ noOfQuestions: _noOfQuestions}, {
        where: {
            moduleId: _moduleId
        }
    });
}

async function updateModuleState(_moduleId, _publish){
    await models.Module.update({ published: _publish}, {
        where: {
            moduleId: _moduleId
        }
    });
}

module.exports = {
    getModule,
    getModulesByUnit,
    updateNoOfQuestions,
    updateModuleState
}