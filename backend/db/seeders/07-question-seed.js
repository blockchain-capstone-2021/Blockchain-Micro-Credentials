'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    var seedData = [];
    for(var m=1; m<=10; m++)
    {
      for(let i =1; i<=20; i++)
      {
        const data = {
          moduleId:m,
          content:`This is example question ${i} for module ${m}`
        };
        seedData.push(data);
      }
    }
    return queryInterface.bulkInsert('Questions', seedData);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Questions', null, {});
  }
};
