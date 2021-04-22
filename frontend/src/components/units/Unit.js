import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import api from '../../apis/api'
import "../dashboards/Dashboard.css";

class Unit extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             unit: null
        }
    }
    
    componentDidMount = async() => {
        this.setModules()
    }

    setModules = async () => {
        const {unitId} = this.props.match.params
        const {studentId} = window.localStorage.getItem('userId')
        window.localStorage.setItem('unitId', unitId)
        const response = await api.get(`/unit/${unitId}/${studentId}`)
        console.log(response.data);
        this.renderModules(response)
        // this.setState({modules: response.data.modules})
        // this.setState({data: <div><section><h1>{this.state.unit.unitId}</h1><p>{this.state.unit.unitName}</p></section></div>})
    }

    renderModules(response) {
        this.setState({modules:
            response.data.modules.map((module, key) => {
              return (
                <tr className="py-2" key={module.moduleId}>
                    <td>{module.moduleName}</td>
                    <td>3</td>
                    <td>7/10</td>
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
