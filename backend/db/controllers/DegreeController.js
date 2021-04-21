const { models } = require('../models/index')


const getDegrees = async (req, res, next) => {
    
    await models.Degree.findAll().then(degrees => {
        res.locals.degrees = degrees
    });
    
    next();
}

module.exports = {
    getDegrees
}