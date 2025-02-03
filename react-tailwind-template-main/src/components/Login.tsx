import React from 'react'
import { FaEye, FaEyeSlash, FaRegUser } from 'react-icons/fa'
import useLogin from '../hooks/useLogin' // Asegúrate de que el hook 'useLogin' esté implementado

// Puedes importar tu logo aquí si es necesario
import EpemaLogo from '../images/logo-epema.svg'

interface LoginProps {
  setUserData: (data: any) => void
  setToken: (token: string | null) => void
}

const Login: React.FC<LoginProps> = ({ setUserData, setToken }) => {
  const {
    username,
    password,
    error,
    showPassword,
    setUsername,
    setPassword,
    setShowPassword,
    handleSubmit,
  } = useLogin()

  const handleLoginSuccess = (responseData: any) => {
    if (responseData) {
      const { token, userData } = responseData
      setUserData(userData)
      setToken(token)
    }
  }

  return (
    <>
      <div className="flex min-h-screen w-screen items-center justify-center bg-white">
        <div className="rounded-lg shadow-lg p-12 border border-gray-300 w-full max-w-5xl py-16 flex flex-col justify-center items-center">
          <div className="flex flex-wrap items-center w-full">
            <div className="hidden w-full xl:block xl:w-1/2">
              <div className="py-12 px-14 text-center">
                <img className="max-w-xl w-full" src={EpemaLogo} alt="Logo" />
              </div>
            </div>

            <div className="w-full xl:w-1/2 xl:border-l-2 border-gray-300">
              <div className="w-full p-12 sm:p-16 xl:p-20">
                <h2 className="mb-12 text-5xl font-bold text-gray-900 text-center">
                  Ingreso al Sistema de Bitacoras
                </h2>

                <form onSubmit={(e) => handleSubmit(e).then(handleLoginSuccess)}>
                  <div className="mb-10">
                    <label className="mb-4 block font-semibold text-gray-800 text-xl">
                      Usuario
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nombre de usuario"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white py-6 pl-6 pr-14 text-xl text-gray-900 outline-none focus:border-[#e52f1f] focus-visible:shadow-md"
                      />
                      <span className="absolute right-5 top-6">
                        <FaRegUser className="w-7 h-7 text-gray-500" />
                      </span>
                    </div>
                  </div>

                  <div className="mb-12">
                    <label className="mb-4 block font-semibold text-gray-800 text-xl">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="***********"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white py-6 pl-6 pr-14 text-xl text-gray-900 outline-none focus:border-[#e52f1f] focus-visible:shadow-md"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-5 flex items-center cursor-pointer text-gray-500 hover:text-gray-900"
                        aria-label="Mostrar u ocultar contraseña"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="w-7 h-7" />
                        ) : (
                          <FaEye className="w-7 h-7" />
                        )}
                      </span>
                    </div>
                    {error && <div className="mt-2 text-red-500 text-lg font-medium text-center">{error}</div>}
                  </div>

                  <div className="mb-10">
                    <button
                      type="submit"
                      className="w-full cursor-pointer rounded-lg border border-[#e52f1f] bg-[#e52f1f] py-6 text-xl font-bold text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Ingresar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
