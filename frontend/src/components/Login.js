import React, { useState } from 'react'
import PropTypes from 'prop-types';
import"./Login.css";

async function loginUser(credentials) {
    return fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

const Login = ({ setToken }) => {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
          username,
          password
        });
        
        window.localStorage.setItem('userId', username);
        // Check if user is a staff or student
        username.startsWith("e") ? window.localStorage.setItem('isStaff', true) : window.localStorage.setItem('isStaff', false)
        console.log(username)
        setToken(token);
    }

    return (
        <div className="jumbotron vertical-center">
        <div className="vertical-center">
            <div className="container w-50">
            <h1 className="text-center">Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <label htmlhtmlFor="inputID" className="col-sm-2 col-form-label">Username (ID)</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="inputID" onChange={e => setUserName(e.target.value)}/>
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlhtmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                    <input type="password" className="form-control" id="inputPassword3" onChange={e => setPassword(e.target.value)}/>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Sign in</button>
            </form>
        </div>
        </div>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default Login;
