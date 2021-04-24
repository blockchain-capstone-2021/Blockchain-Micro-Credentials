import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import microcredapi from '../../apis/microcredapi';
import "../dashboards/Dashboard.css";

class Unit extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             unit: null,
             studentId: window.localStorage.getItem('userId')
        }
    }
    
    componentDidMount = async() => {
        this.getResponse()
    }

    getResponse = async () => {
        // Set variables
        const {unitId} = this.props.match.params
        window.localStorage.setItem('unitId', unitId)
        this.setState({unit: window.localStorage.getItem('unitId')})

        // Make calls
        const moduleResponse = await microcredapi.get(`/unit/${unitId}/${this.state.studentId}`)
        const unitResponse = await microcredapi.get(`/student/${this.state.studentId}/enrolled`)
        console.log(moduleResponse.data);

        // send responses
        this.renderUnit(unitResponse)
        this.renderModules(moduleResponse)
    }

    renderUnit = async (response) => {
        this.setState({unitMap: response.data.unitMap})
        this.setState({data: <div><section><h1>{this.state.unitMap[this.state.unit]}</h1><h3>{this.state.unit}</h3></section></div>})
    }

    renderModules(response) {
        this.setState({highestScore: response.data.highestScore})
        this.setState({attempts: response.data.numAttempts})
        this.setState({modules:
            response.data.modules.map((module, key) => {
                console.log();
              return (
                <tr className="py-2" key={module.moduleId}>
                    <td>{module.moduleName}</td>
                    <td>{this.state.attempts[key+1]}</td>
                    <td>{this.state.highestScore[key+1]}</td>
                    <td><Link to={{pathname: `/module/${module.moduleId}`, attemptNumber: this.state.attempts[key+1]}} className="btn btn-primary">Go</Link></td>
                </tr>
              )
            })
          })
    }
    
    async submitMicroCredential() {
        await microcredapi.get(`unit/submit/${window.localStorage.getItem('userId')}/${window.localStorage.getItem('unitId')}/${window.localStorage.getItem('enrolmentPeriod')}`)

    }

    render() {
        return (
            <div className="jumbotron align-center">
            <div className="container mt-5">
                {this.state.data}
                <section>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th># of Attempts</th>
                                <th>Best result</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.modules ? this.state.modules : "  loading..."}
                        </tbody>
                    </table>
                    <div>
                    <button type="button" name="" id="" class="btn btn-primary btn-block" data-bs-toggle="modal" data-bs-target="#exampleModal">Submit</button>
                    </div>
                </section>

                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Submit Modules?</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Are you sure that you want to submit modules?<br/> Once submitted, you will no longer be able to take quizs for this course.
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success" onClick={() => this.submitMicroCredential()}>Submit</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default Unit
