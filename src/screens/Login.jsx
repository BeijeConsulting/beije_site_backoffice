import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import useService from '../hooks/useService';
import login_style from "./Login.module.css";
;

const Login = () => {

  const [state, setState] = useState({
    username: "",
    password: ""
  })

  const navigate = useNavigate();

  const [result, call] = useService("/signin", { method: "post" });

  useEffect(() => {
    if (result.error) {
      toast.error('Errore. Email o password errati!')
      if (result.error.status === 500) {
        toast.error("C'è un errore con il server. Riprova più tardi!")
      }
    }
    else if (result.response) {
      navigate('/')
    }
  }, [result])


  const handleSubmitForm = (e) => {
    e.preventDefault()
    const { username, password } = state;
    let check = validateEmail(username);
    if (!check) {
      toast.error('Errore. Email non è valida')
    }
    else {
      call(
        {
          username,
          password
        }
      )
    }
  }

  const validateEmail = (value) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
  }

  return (
    <main className={login_style.container}>

      <div className={login_style.form_container}>
        <Toaster />
        <form
          className={login_style.form}
          onSubmit={handleSubmitForm}
        >
          <h1>Login</h1>
          <TextInput
            value={state.username}
            type="email"
            name="username"
            placeholder="Email"
            onChange={(e) => { setState(prev => ({ ...prev, username: e.target.value })) }}
          />
          <TextInput
            value={state.password}
            type="password"
            name="pws"
            placeholder="Password"
            onChange={(e) => { setState(prev => ({ ...prev, password: e.target.value })) }}
          />
          <button
            type="submit">
            login
          </button>
        </form>
      </div>
    </main>
  )
}

export default Login