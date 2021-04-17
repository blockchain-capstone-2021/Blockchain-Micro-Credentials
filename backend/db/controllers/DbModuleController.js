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

    await models.Question.findAll({
        where: {
          unitId: _unitId
        }
      }).then( modules => {
        _modules = modules;
    });
  
    return _modules;
}

module.exports = {
    getModule,
    getModulesByUnit
}