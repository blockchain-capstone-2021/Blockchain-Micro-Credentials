const { models } = require('../models/index')

async function getQuestions (_moduleId, noOfQuestions) 
{
    let _questions;
    let _returnQuestions = [];

    await models.Question.findAll({
        where: {
          moduleId: _moduleId
        }
      }).then( questions => {
        _questions = questions;
    });
    
    for(var i=1; i<=noOfQuestions; i++)
    {
        var index = Math.floor(Math.random()*(_questions.length-1)+0);
        
        let question = _questions.splice(index, 1);

        console.log(question);

        _returnQuestions.push(question)
    }


    console.log(_questions.length);

    // _returnQuestions.forEach(question => {
    //     console.log(question)
    // });


    // console.log(_questions);

    // return _returnQuestions;
}

getQuestions(10, 10);
// module.exports = {
//     getQuestions
// }