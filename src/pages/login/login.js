import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  const onButtonClick = () => {
    setEmailError('')
    setPasswordError('')

    if ('' === email) {
      setEmailError('Favor ingrese su correo')
      return
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Ingrese un correo valido')
      return
    }

    if ('' === password) {
      setPasswordError('Ingrese su contraseña')
      return
    }
  
    if (password.length < 7) {
      setPasswordError('Debe tener 8 caracteres como maximo')
      return
    }
  
    checkAccountExists((accountExists) => {
      if (accountExists) logIn()
      else if (
        window.confirm(
          'No existe este correo: ' + email + '. Debe crearlo',
        )
      ) {
        logIn()
      }
    })
  }

  const checkAccountExists = (callback) => {
    fetch('http://localhost:3080/check-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((r) => {
        callback(r?.userExists)
      })
  }

  const logIn = () => {
    fetch('http://localhost:3080/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => r.json())
      .then((r) => {
        if ('success' === r.message) {
          localStorage.setItem('user', JSON.stringify({ email, token: r.token }))
          props.setLoggedIn(true)
          props.setEmail(email)
          navigate('/')
        } else {
          window.alert('Wrong email or password')
        }
      })
  }

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={email}
          placeholder="Ingrese correo"
          onChange={(ev) => setEmail(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={password}
          placeholder="Ingrese contraseña"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>
    </div>
  )
}

export default Login