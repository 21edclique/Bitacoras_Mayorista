import React from 'react'
import { FaEye, FaEyeSlash, FaRegUser } from 'react-icons/fa'
import useLogin from '../hooks/useLogin'
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
    <div className="flex min-h-screen w-screen items-center justify-center bg-white dark:bg-gray-900">
    <div className="w-full md:rounded-lg md:shadow-lg md:p-8 md:p-12 md:border md:border-gray-300 md:dark:border-gray-700 max-w-5xl flex flex-col justify-center items-center bg-white dark:bg-gray-800">
      <div className="flex flex-wrap items-center w-full">
          <div className="w-full xl:w-1/2">
            <div className="py-8 px-8 text-center">
              <img 
                className="max-w-[280px] md:max-w-xl mx-auto w-full" 
                src={EpemaLogo} 
                alt="Logo" 
              />
            </div>
          </div>

          <div className="w-full xl:w-1/2 xl:border-l-2 border-gray-300 dark:border-gray-700">
            <div className="w-full p-6 sm:p-12">
              <h2 className="mb-8 text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-center xl:block hidden">
              Ingreso al Sistema de Bitácoras
              </h2>

              <form onSubmit={(e) => handleSubmit(e).then(handleLoginSuccess)} className="max-w-md mx-auto">
                <div className="mb-6">
                  <label className="mb-2 block font-semibold text-gray-800 dark:text-gray-200 text-lg">
                    Usuario
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nombre de usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white dark:bg-gray-700 py-4 pl-4 pr-12 text-lg text-gray-900 dark:text-gray-100
                        outline-none focus:border-[#e52f1f] focus:ring-2 focus:ring-red-100 
                        dark:focus:ring-red-900 transition-all
                        placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />
                    <FaRegUser className="absolute right-4 top-4 w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="mb-2 block font-semibold text-gray-800 dark:text-gray-200 text-lg">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="***********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-700 py-4 pl-4 pr-12 text-lg text-gray-900 dark:text-gray-100
                        outline-none focus:border-[#e52f1f] focus:ring-2 focus:ring-red-100
                        dark:focus:ring-red-900 transition-all
                        placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 
                        hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                      aria-label="Mostrar contraseña"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="w-6 h-6" />
                      ) : (
                        <FaEye className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                  {error && (
                    <div className="mt-2 text-red-500 dark:text-red-400 text-base font-medium text-center">
                      {error}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#e52f1f] py-4 text-lg font-bold text-white
                    transition-all hover:bg-opacity-90 focus:ring-4 focus:ring-red-200
                    dark:focus:ring-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Ingresar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login