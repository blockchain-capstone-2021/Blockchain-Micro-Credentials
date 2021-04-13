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
        const response = await api.get(`/unit/${unitId}`)
        const modulesResponse = await api.get(`/unit/${unitId}/modules`)
        console.log(modulesResponse.data);
        this.setState({unit: response.data.unit[0]})
        this.setState({data: <div><section><h1>{this.state.unit.unitId}</h1><p>{this.state.unit.unitName}</p></section></div>})
        this.renderModules(modulesResponse)
    }

    renderModules(response) {
        this.setState({modules:
            response.data.modules.map((module, key) => {
              return (
                <tr className="py-2">
                    <td scope="row">{module.moduleId}</td>
                    <td>{module.moduleName}</td>
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
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
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
