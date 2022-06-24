import React, { useEffect, useState } from "react";
// @ts-ignore
import logo from "./logo.svg";
import axios from "axios";
import "./App.css";

const apiUrl = `http://localhost:8080`;

const App = () => {
  const [state, setState] = useState<{ users: { _id: number }[] }>({
    users: [],
  });

  const createUser = async () => {
    await axios.get(apiUrl + "/user-create");
    loadUsers();
  };

  const loadUsers = async () => {
    const res = await axios.get(apiUrl + "/users");
    setState({
      users: res.data,
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => createUser()}>Create User</button>
        <p>Users list:</p>
        <ul>
          {state.users.map((user) => (
            <li key={user._id}>id: {user._id}</li>
          ))}
        </ul>
      </header>
    </div>
  );
};

export default App;
