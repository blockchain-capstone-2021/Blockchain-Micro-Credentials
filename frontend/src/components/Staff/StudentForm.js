import React, { Component } from 'react'
import api from '../../apis/api'

export default class StudentForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
             student: this.props.student,
             options: this.props.options,
             studentId: this.props.student ? this.props.student.studentId : "",
             studentName: this.props.student ? this.props.student.studentName : "",
             degreeId: this.props.student ? this.props.student.degreeId : "",
             studentEmail: this.props.student ? this.props.student.studentEmail : "",
             studentCreditPoints: this.props.student ? parseInt(this.props.student.studentCreditPoints) : 0,
             passwordHash: this.props.student? this.props.student.passwordHash : ""
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
                let selected = "";
                if(this.state.student){
                    selected = (degree.degreeId === this.state.student.degreeId) ? "selected" : ""
                }
                return (<option key={degree.degreeId} name={degree.degreeId} value={degree.degreeId} {...selected}>{degree.degreeName}</option>)
            })
            return Promise.all(render).then(() => {
                this.setState({options: render})
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
        this.setState({studentCreditPoints: e.target.value })
    }

    onPasswordChange(e){
        this.setState({passwordHash: e.target.value })

    }

    async onSubmit(e) {
        e.preventDefault();
        const route = (!this.state.student) ? '/student/create' : `/student/${this.state.student.studentId}/edit`
        await api.post(route, {
            studentId: this.state.studentId,
            studentName: this.state.studentName,
            degreeId: this.state.degreeId,
            studentEmail: this.state.studentEmail,
            studentCreditPoints: this.state.studentCreditPoints,
            passwordHash: this.state.passwordHash
        })
        this.props.history.push('/students')
    }
    
    onCreateForm(property) {
        if(!this.state.student) {
            return 
        }
        return this.state.student[property]
    }

    render() {
        return (
            <div>
                <form onSubmit={(e) => {this.onSubmit(e)}}>
                    <div className="form-group  my-4">
                        <label htmlhtmlFor="studentId">Student Id</label>
                        <input type="text" className="form-control" name="studentId" id="studentId" aria-describedby="studentId" placeholder="Student Id" value={this.state.studentId} onChange={(e) => this.onIdChange(e)}  />
                    </div>
                    <div className="form-group  my-4">
                        <label htmlhtmlFor="studentName">Student Name</label>
                        <input type="text" className="form-control" name="studentName" id="studentName" aria-describedby="studentName" placeholder="Student Name" value={this.state.studentName} onChange={(e) => this.onNameChange(e)}  />
                    </div>
                    <div className="form-group  my-4">
                        <label htmlhtmlFor="degree">Degree</label>
                        <select className="form-control form-control" name="degree" value={this.state.degreeId} onChange={(e) => this.onDegreeChange(e)}>
                        <option name="dummy" key="dummy">Select a degree</option>
                        {this.state.options}
                        </select>
                    </div>
                    <div className="form-group  my-4">
                        <label htmlhtmlFor="studentEmail">Student Email</label>
                        <input type="email" className="form-control" name="studentEmail" id="studentEmail" aria-describedby="studentEmail" placeholder="Student Email" value={this.state.studentEmail} onChange={(e) => this.onEmailChange(e)}  />
                    </div>
                    <div className="form-group  my-4">
                        <label htmlhtmlFor="studentCreditPoints">Credit Points</label>
                        <input type="number" className="form-control" name="studentCreditPoints" id="studentCreditPoints" aria-describedby="studentCreditPoints" max="288" placeholder="Credit Points" value={this.state.studentCreditPoints} onChange={(e) => this.onCreditChange(e)}  />
                    </div>
                    <div className="form-group  my-4">
                        <label htmlhtmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" id="password" placeholder="Password" value={this.onCreateForm("passwordHash")} onChange={(e) => this.onPasswordChange(e)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                </form>
            </div>
        )
    }
}
