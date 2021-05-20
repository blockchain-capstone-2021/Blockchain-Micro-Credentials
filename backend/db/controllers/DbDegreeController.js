const { models } = require('../models/index');

//return a degree for a given degreeId
async function getDegree(degreeId) {
    let _degree;

    await models.Degree.findByPk(degreeId).then(degree => {
        _degree = degree;
    });

    return _degree;
}

module.exports = {
    getDegree
};