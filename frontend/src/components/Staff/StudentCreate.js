import React, { Component } from 'react'
import api from '../../apis/api'

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
                return (<option value={degree.degreeId}>{degree.degreeName}</option>)
            })
            return Promise.all(render).then(() => {
                this.setState({data: render})
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
        console.log(e.target.value);
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

    async onSubmit(e) {
        e.preventDefault();
        await api.post('/student/create', {
            studentId: this.state.studentId,
            studentName: this.state.studentName,
            degreeId: this.state.degreeId,
            studentEmail: this.state.studentEmail,
            studentCreditPoints: this.state.credit,
            passwordHash: this.state.password
        })
    }


     
    render() {
        return (
            <div className="container">
                <form onSubmit={(e) => {this.onSubmit(e)}}>
                    <div class="form-group  my-4">
                        <label for="studentId">Student Id</label>
                        <input type="text" class="form-control" name="studentId" id="studentId" aria-describedby="studentId" placeholder="Student Id" onChange={(e) => this.onIdChange(e)}  />
                    </div>
                    <div class="form-group  my-4">
                        <label for="studentName">Student Name</label>
                        <input type="text" class="form-control" name="studentName" id="studentName" aria-describedby="studentName" placeholder="Student Name" onChange={(e) => this.onNameChange(e)}  />
                    </div>
                    <div class="form-group  my-4">
                        <label for="degree">Degree Id</label>
                        <select class="form-control form-control" name="degree"  onChange={(e) => this.onDegreeChange(e)}>
                        <option>Select a Degree</option>
                        {this.state.data}
                        </select>
                    </div>
                    <div class="form-group  my-4">
                        <label for="studentEmail">Student Email</label>
                        <input type="email" class="form-control" name="studentEmail" id="studentEmail" aria-describedby="studentEmail" placeholder="Student Email" onChange={(e) => this.onEmailChange(e)}  />
                    </div>
                    <div class="form-group  my-4">
                        <label for="studentCreditPoints">Credit Points</label>
                        <input type="number" class="form-control" name="studentCreditPoints" id="studentCreditPoints" aria-describedby="studentCreditPoints" max="288" placeholder="Credit Points"  onChange={(e) => this.onCreditChange(e)}  />
                    </div>
                    <div class="form-group  my-4">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" name="password" id="password" placeholder="Password"  onChange={(e) => this.onPasswordChange(e)} />
                    </div>
                    <button type="submit" class="btn btn-primary">Save</button>
                </form>
            </div>
        )
    }
}

export default StudentCreate