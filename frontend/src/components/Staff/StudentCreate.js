import React, { Component } from 'react'

import api from '../../apis/api'
import StudentForm from './StudentForm'

class StudentCreate extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            degrees: null
        }
    }

    async componentDidMount() {
        await api.get('/degree').then( degrees => {
            this.setState({degrees: degrees.data.degrees.map(degree => {
                return degree
            })})
        }
        )
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.degrees !== this.state.degrees) {
            this.setState({degrees: this.state.degrees})
            const render = this.state.degrees.map(degree => {
                return (<option key={degree.degreeId} defaultValue={degree.degreeId}>{degree.degreeName}</option>)
            })
            render.unshift(<option defaultValue="" disabled hidden>Select a Degree</option>)
            return Promise.all(render).then(() => {
                this.setState({data: render})
                this.setState({form : <StudentForm type="CREATE" options={render} history={this.props.history} />})
            })
        }
    }

    onIdChange(e){
        this.setState({studentId: e.target.value })
    }

    onNameChange(e){
        this.setState({studentName: e.target.value })
    }

    onDegreeChange(e){
        this.setState({degreeId: e.target.value })
    }

    onEmailChange(e){
        this.setState({studentEmail: e.target.value })
    }

    onCreditChange(e){
        this.setState({credit: e.target.value })
    }

    onPasswordChange(e){
        this.setState({password: e.target.value })

    }
     
    render() {
        return (
            <div className="container">
                <h1>Create Student</h1>
                {this.state.form}
            </div>
        )
    }
}

export default StudentCreate