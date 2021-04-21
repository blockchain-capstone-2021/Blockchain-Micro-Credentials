import React, { Component } from 'react'
import Question from './Question'
import api from '../../apis/api';

class Module extends Component {

    constructor(props) {
        super(props)
        this.state = {
             moduleId: this.props.match.params.moduleId
        }
    }

    componentDidMount = async () => {
        window.localStorage.setItem('moduleId', this.props.match.params.moduleId)
        this.setState({header: this.renderHeaderSection(this.state.moduleId)});
        this.setState({questions: await this.getQuestions()}); 
        const newQuestions = []
        await this.state.questions.map(async (question, key) => {
            const answers = await api.get(`/questions/${question.questionId}/answers`)
            const nQuestion = {...question, answers: answers.data.answers, key: question.questionId}
            newQuestions.push(nQuestion)
        });
        this.setState({questions: newQuestions})
        setTimeout(() => {
            this.setState({render: this.renderQuestions(this.state.questions)})
        }, 3000);
        
        }  

    displayQuestions(renderData) {
        if(renderData !== undefined) {
            return this.state.render
        }
        return <p>Loading</p>
    }
    
    renderQuestions(x){
        return x.map((question) => {
            return (
                <Question key={question.questionId} question={question} data={question.answers} />
            )
        })
    }
    async getQuestions(){
        const questions =  await api.get(`questions/${this.props.match.params.moduleId}/10`)
        .then(response => response.data.questions)
        return questions;
    };

    
    async getAnswers(questionId) {
        const answers = await api.get(`questions/${questionId}/answers`)
        .then(response => response.data.answers)
        return answers
    }
    
    renderHeaderSection(number){
        return (
            <div>
                <section>
                    <h6 className="">{`Module ${number}`}</h6>
                    <h6>Attempt #</h6>
                </section>
            </div>
        )
    }
   

    render() {
        return (
            <div className="container mt-3">
                {this.state.header}
                <section>
                <form method="post">
                {this.displayQuestions(this.state.render)}  
                <input type="hidden" id="enrolmentPeriod" name="enrolmentPeriod" value={window.localStorage.getItem('enrolmentPeriod')}/>
                <input type="hidden" id="moduleId" name="moduleId" value={window.localStorage.getItem('moduleId')}/>
                <input type="hidden" id="unitId" name="unitId" value={window.localStorage.getItem('unitId')}/>
                <input type="hidden" id="studentId" name="studentId" value={window.localStorage.getItem('userId')} />
                <button type="submit" className="btn btn-primary">Submit</button>
                </form>  
                </section>
                
            </div>
        )
    }

}

export default Module
