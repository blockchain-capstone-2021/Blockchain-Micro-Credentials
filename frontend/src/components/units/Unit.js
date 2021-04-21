import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import api from '../../apis/api'

class Unit extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             unit: null
        }
    }
    
    componentDidMount = async() => {
        const {unitId} = this.props.match.params
        window.localStorage.setItem('unitId', unitId)
        const response = await api.get(`/unit/${unitId}`)
        const modulesResponse = await api.get(`/unit/${unitId}/modules`)
        this.setState({unit: response.data.unit[0]})
        this.setState({data: <div><section><h1>{this.state.unit.unitId}</h1><p>{this.state.unit.unitName}</p></section></div>})
        this.renderModules(modulesResponse)
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
        )
    }
}


export default Unit
