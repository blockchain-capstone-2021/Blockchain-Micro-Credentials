import React from 'react'
import { Link } from 'react-router-dom'

const UnitDetail = (props) => {

    // API call to retrieve all data for
    // modules in selected unit

    const modules = [
        {moduleId: 1, moduleName: 'Security in IT Module 1'},
        {moduleId: 2, moduleName: 'Security in IT Module 2'},
        {moduleId: 3, moduleName: 'Security in IT Module 3'},
        {moduleId: 4, moduleName: 'Security in IT Module 4'},
        {moduleId: 5, moduleName: 'Security in IT Module 5'},
    ]

    const renderModules = () => {
        return modules.map(module => {
            return (<tr>
                <td scope="row">{module.moduleId}</td>
                <td>{module.moduleName}</td>
                <td>3</td>
                <td>8</td>
                <td><Link to={`/module/:moduleId`} className="btn btn-primary">Take quiz</Link></td>
            </tr>)
        })

    }

    return (
        <div className="container">
            <section>
                <h1>{props.unitName}</h1>
            </section>
            <h2>Modules</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Module Name</th>
                        <th>Attempts</th>
                        <th>Highest Score</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {renderModules()}
                </tbody>
            </table>
        </div>
    )
}

export default UnitDetail
