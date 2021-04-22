import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import api from '../../apis/api'
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
        const moduleResponse = await api.get(`/unit/${unitId}/${this.state.studentId}`)
        const unitResponse = await api.get(`/student/${this.state.studentId}/enrolled`)
        console.log(moduleResponse.data);

        // send responses
        this.renderModules(moduleResponse)
        this.renderUnit(unitResponse)
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
              return (
                <tr className="py-2" key={module.moduleNo}>
                    <td>{module.moduleName}</td>
                    <td>{}</td>
                    <td>{}</td>
                    <td><Link to={`/module/${module.moduleId}`} className="btn btn-primary">Go</Link></td>
                </tr>
              )
            })
          })
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
                            {this.state.modules}
                        </tbody>
                    </table>
                </section>
            </div>
            </div>
        )
    }
}


export default Unit
