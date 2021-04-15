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

module.exports = {
    getModule
}