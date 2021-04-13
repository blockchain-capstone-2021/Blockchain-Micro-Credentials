import React from 'react'
import Module from '../modules/Module'
import {Link} from 'react-router-dom'
import Unit from '../units/Unit'
const Dashboard = (props) => {

    const units = [
        {
            unitId: 'COSC2536',
            unitName: 'Security in Computing and Information Technology'
        }
    ]

  // Conditionally call api methods based upon user type (Student or Staff)

  // TODO: Create seperate dashboard js files for staff and student. Better this way, otherwise

  const courseProgress = () => {
    // make an API call to express to pull latest module data
    // THEN render each module where needed.
  }

  const moduleProgress = () => {
    // make an API call to express to pull latest module data
    // THEN render each module under the Modules section.
  }

  const renderUnits = () => {
    return units.map(unit => {
        return <Unit unitId={unit.unitId} unitName={unit.unitName} />
    })
  }

    return (
        <div className="container">
            <main role="main" ><div className="chartjs-size-monitor" classNamele="position: absolute; inset: 0px; overflow: hidden; pointer-events: none; visibility: hidden; z-index: -1;"><div className="chartjs-size-monitor-expand" classNamele="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div classNamele="position:absolute;width:1000000px;height:1000000px;left:0;top:0"></div></div><div className="chartjs-size-monitor-shrink" classNamele="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div classNamele="position:absolute;width:200%;height:200%;left:0; top:0"></div></div></div>
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
          </div>
          <section className="mb-5">
          <h2>Units</h2>
          {renderUnits()}
          </section>
        </main>
        </div>
    )
}

export default Dashboard
