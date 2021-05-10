'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    var seedData = [];

    //Security
    for(let m=1; m<=10; m++)
    {
      for(let i =1; i<=30; i++)
      {
        const data = {
          moduleId:m,
          content:`This is example question ${i} for module ${m}`
        };
        seedData.push(data);
      }
    }

    //Blockchain
    for(let m=11; m<=22; m++)
    {
      for(let i =1; i<=30; i++)
      {
        const data = {
          moduleId:m,
          content:`This is example question ${i} for module ${m-10}`
        };
        seedData.push(data);
      }
    }

    //WDT
    for(let m=23; m<=30; m++)
    {
      for(let i =1; i<=30; i++)
      {
        const data = {
          moduleId:m,
          content:`This is example question ${i} for module ${m-22}`
        };
        seedData.push(data);
      }
    }

    //I3D
    for(let m=31; m<=36; m++)
    {
      for(let i =1; i<=30; i++)
      {
        const data = {
          moduleId:m,
          content:`This is example question ${i} for module ${m-30}`
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
