import { useState } from 'react';

export default function useToken() {

  // retrieve token from localStorage
  const getToken = () => {
      const tokenString = localStorage.getItem('token');
      const userToken = JSON.parse(tokenString);
      return userToken?.token
  };

  // set state variables for component
  const [token, setToken] = useState(getToken);

  // set token in localStorage
  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token
  }
}