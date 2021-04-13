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
        this.setState({header: this.renderHeaderSection(this.state.moduleId)})
        this.renderQuestions()
    }

    renderQuestions = async () => {
        const response = await api.get(`questions/${this.props.match.params.moduleId}/10`)
        this.setState({questions:
            response.data.questions.map((question, key) => {
                return (
                    <Question questionId={question.questionId} content={question.content} />
                )
            })
        })
    }
    
    renderHeaderSection(number){
        
        return (
            <div>
                <section>
                    <h6 className="">{`Module ${number}`}</h6>
                    <h6>Attempts</h6>
                </section>
            </div>
        )
    }
   

    render() {
        return (
            <div className="container mt-3">
                {this.state.header}
                {this.state.questions}
            </div>
        )
    }

}

export default Module
