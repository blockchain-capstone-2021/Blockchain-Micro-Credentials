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
        this.setState({unit: response.data.unit[0]})
        this.setState({data: <div><section><h1>{this.state.unit.unitId}</h1><p>{this.state.unit.unitName}</p></section></div>})
    }

    render() {
        return (
            <div className="container mt-5">
                {this.state.data}
            </div>
        )
    }
}


export default Unit
