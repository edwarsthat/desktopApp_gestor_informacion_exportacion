/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react'
import logo from '../../assets/1.webp'
import "./css/styles.css"
import "../../css/main.css"


export default function Login(): JSX.Element {
  let check = true;
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errUser, setErrUser] = useState<boolean>(false)
  const [errPass, setErrPass] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false)

  // const handleForgotPassword = (): void => {
  //   setIsForgotPassword(true)
  //   setPassword('')
  //   setErrPass(false)
  //   setErrUser(false)
  // }

  const handleRecoverySubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()
    try{
      const datosLogIn = {
        user: username.trim().toLowerCase(),
      }
      const response = await window.api.forgotPassword(datosLogIn)
      if (response.status === 200) {
        console.log('Se ha enviado un correo electrónico con tu nueva contraseña.')
      } else {
        console.log('Error al enviar el correo electrónico. Por favor, verifica tu nombre de usuario.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleBackToLogin = (): void => {
    setIsForgotPassword(false)
    setUsername('')
  }

  const handleSubmit = async (event): Promise<void> => {
    try {
      if (check) {
        event.preventDefault()
        check = false
        const datosLogIn = {
          user: username.trim().toLowerCase(),
          password: password,
        }
        const response = await window.api.user2(datosLogIn)
        
        if (response.status === 401) {
          setErrUser(true)
          setTimeout(() => {
            setErrUser(false)
          }, 3000)
        } else if (response.status === 402) {
          setErrPass(true)
          setTimeout(() => {
            setErrPass(false)
          }, 3000)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      check = true
    }
  }

  useEffect(() => {
    setErrUser(false)
    setErrPass(false)
  }, [username, password])
  return (
    <div className='loginContainer'>      <form onSubmit={isForgotPassword ? handleRecoverySubmit : handleSubmit} className={`formLogin`}>
        {isForgotPassword && (
          <div className="recovery-instructions">
            <p>Por favor, ingresa tu nombre de usuario.</p>
            <p>Se enviará un correo electrónico con tu nueva contraseña a la dirección asociada a tu cuenta.</p>
          </div>
        )}
        <div className='loginInput'>
          <label>Usuario</label>
          <input
            className={"defaultSelect"}
            id="username"
            type="text"
            value={username}
            onChange={(e): void => setUsername(e.target.value)}
          />
          <div className="errorContainer">
            <p
              style={{ visibility: errUser ? 'visible' : 'hidden' }}
              className={"errorText"}>
              {errUser ? 'Usuario incorrecto' : '   '}
            </p>
          </div>
        </div>
        {!isForgotPassword && (
          <div className='loginInput'>
            <label>Contraseña</label>
            <div className="password-container">
              <input
                className={"defaultSelect"}
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e): void => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={(): void => setShowPassword(!showPassword)}
                className="password-toggle-button"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <div className="errorContainer">
              <p
                style={{ visibility: errPass ? 'visible' : 'hidden' }}
                className={"errorText"}>
                {errPass ? 'Contraseña incorrecta' : '   '}
              </p>
            </div>
            <div className="forgot-password">
              {/* <a onClick={handleForgotPassword}>¿Olvidaste tu contraseña?</a> */}
            </div>
          </div>
        )}
        <div className="loginbuttonsDiv">
          <button
            className="defaulButtonAgree"
            type="submit"
          >
            {isForgotPassword ? 'Enviar' : 'Iniciar'}
          </button>
          {isForgotPassword && (
            <button
              type="button"
              className="defaulButtonCancel"
              onClick={handleBackToLogin}
            >
              Volver
            </button>
          )}
        </div>
        <div className="loginImgDiv">
          <img
            src={logo}
          />
        </div>

      </form>
    </div>
  )
}
