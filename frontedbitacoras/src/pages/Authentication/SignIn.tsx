import React, { useState } from 'react';
//my imports
import ChaskiLogoB from '../../images/ep-ema-black_1.svg';
import { FaEye, FaEyeSlash, FaRegUser } from 'react-icons/fa';
import useSignup from '../../hooks/useSignup';
import { UserSignUpT } from '../../types';

const initialStateLogin: UserSignUpT = {
  username: '',
  password: ''
}
const SignIn: React.FC = () => {

  const [inputLogin, setInputLogin] = useState<UserSignUpT>(initialStateLogin);
  
  const { loading, login } = useSignup();
  const [showPassword, setShowPassword] = useState(false);

  //e evento automatico cuando cambia el input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLogin({
      //spread operator, copia los atributos del objeto inputLogin
      ...inputLogin,
      [e.target.id]: e.target.value //cambia el valor del atributo name del objeto inputLogin

    });
  }

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(inputLogin);
  }


  return (
    <>
      <div className="flex h-screen items-center justify-center dark:bg-boxdark">
        <div className=" rounded-lg shadow-lg p-6 dark:border-strokedark dark:bg-boxdark w-[90%] my-auto">
          <div className="flex flex-wrap items-center">
            <div className="hidden w-full xl:block xl:w-1/2">
              <div className="py-10 px-12 text-center">
                <img className="dark:hidden" src={ChaskiLogoB} alt="Logo" />
              </div>
            </div>

            <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
              <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                  Ingreso Sistemas Monitoreo
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Usuario
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nombre de usuario"
                        id="username"
                        value={inputLogin.username}
                        onChange={handleChange}

                        className="w-full rounded-lg border border-stroke  bg-transparent  py-4 pl-6 pr-10 text-black outline-none focus:border-[#e52f1f] focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />

                      <span className="absolute right-4 top-4">
                        <FaRegUser className="w-[22px] h-[22px]" />
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="***********"
                        id="password"
                        value={inputLogin.password}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-[#e52f1f] focus-visible:shadow-none dark:border-form-strokedark dark:bg-[#e52f1f] dark:text-white dark:focus:border-[#e52f1f]"
                      />
                      <span className="absolute right-12 top-4">
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-gray-500 hover:text-black dark:hover:text-white"
                        aria-label="Mostrar u ocultar contraseña"
                      >
                        {showPassword ? (
                          <FaEye className="w-[22px] h-[22px]" />
                        ) : (
                          <FaEyeSlash className="w-[22px] h-[22px]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mb-5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full cursor-pointer rounded-lg border border-[#e52f1f] bg-[#e52f1f] p-4 text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        'Ingresar'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
