'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    let potentialNoOfQuestions = [10,15,20]
    //Security
    for(let i =1; i<=10; i++)
    {
      randomIndex = Math.floor(Math.random()*3)
      const module = {
        unitId: 'COSC2536',
        moduleName: 'Security in IT Module '+i,
        moduleNo: i,
        noOfQuestions: potentialNoOfQuestions[randomIndex],
        published: true,
        weight: 10
      };
      seedData.push(module);
    }

    //Blockchain
    let weightsBlockchain = [5,5,5,5,5,25,5,5,5,5,5,25]
    for(let i =1; i<=12; i++)
    {
      randomIndex = Math.floor(Math.random()*3)
      const module = {
        unitId: 'INTE2554',
        moduleName: 'Blockchain Module '+i,
        moduleNo: i,
        noOfQuestions: potentialNoOfQuestions[randomIndex],
        published: true,
        weight: weightsBlockchain[i-1]
      };
      seedData.push(module);
    }

    //WDT
    let weightsWDT = [10,10,10,20,10,10,10,20]
    for(let i =1; i<=8; i++)
    {
      randomIndex = Math.floor(Math.random()*3)
      const module = {
        unitId: 'COSC2277',
        moduleName: 'Web Development Technologies Module '+i,
        moduleNo: i,
        noOfQuestions: potentialNoOfQuestions[randomIndex],
        published: true,
        weight: weightsWDT[i-1]
      };
      seedData.push(module);
    }

    //I3D
    let weightsI3D = [5,5,30,5,5,50]
    for(let i =1; i<=6; i++)
    {
      randomIndex = Math.floor(Math.random()*3)
      const module = {
        unitId: 'COSC1186',
        moduleName: 'Interactive 3D Graphics Module '+i,
        moduleNo: i,
        noOfQuestions: potentialNoOfQuestions[randomIndex],
        published: true,
        weight: weightsI3D[i-1]
      };
      seedData.push(module);
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Modules', null, {});
  }
};
