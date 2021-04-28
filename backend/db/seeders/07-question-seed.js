'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    var seedData = [];
    let potentialQuestionPool = [20,30,40]

    //Security
    for(let m=1; m<=10; m++)
    {
      let randomIndex = Math.floor(Math.random()*3)
      let questionPool = potentialQuestionPool[randomIndex]
      for(let i =1; i<=questionPool; i++)
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
      let randomIndex = Math.floor(Math.random()*3)
      let questionPool = potentialQuestionPool[randomIndex]
      for(let i =1; i<=questionPool; i++)
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
      let randomIndex = Math.floor(Math.random()*3)
      let questionPool = potentialQuestionPool[randomIndex]
      for(let i =1; i<=questionPool; i++)
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
      let randomIndex = Math.floor(Math.random()*3)
      let questionPool = potentialQuestionPool[randomIndex]
      for(let i =1; i<=questionPool; i++)
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
