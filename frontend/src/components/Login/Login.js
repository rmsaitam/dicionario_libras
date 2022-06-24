import React, {Component, useState} from "react";
import '../../styles/login.css';
import '../../App.css';

import 'react-toastify/dist/ReactToastify.css';
import {useHistory} from "react-router-dom";



function Login(props) {
    const [register, setRegister ] = useState(true);
    const history = useHistory();
    const backBtn = () => {
        history.push('/');
    }


    return (

        <div
            className="p-20 h-screen w-screen flex flex-col-reverse md:flex-row items-center justify-center bg-indigo-400">
            <div className="container mx-auto flex flex-col items-center">
                <button onClick={backBtn} className="hover:bg-gray-300 mb-3 bg-white text-black p-3 rounded-lg font-semibold text-lg">
                     Voltar
                </button>
                <form className="shadow-lg w-80 p-4 flex flex-col bg-white rounded-lg">
                    <input type="text" placeholder="Email"
                           className="mb-3 py-3 px-4 border border-gray-400 focus:outline-none rounded-md focus:ring-1 ring-cyan-500"/>
                    <input type="text" placeholder="Senha"
                           className="mb-3 py-3 px-4 border border-gray-400 focus:outline-none rounded-md focus:ring-1 ring-cyan-500"/>
                    {register &&
                        <>
                        <input type="text" placeholder="Confirmação de senha"
                               className="mb-3 py-3 px-4 border border-gray-400 focus:outline-none rounded-md focus:ring-1 ring-cyan-500"/>

                        <input type="text" placeholder="Usuário"
                               className="mb-3 py-3 px-4 border border-gray-400 focus:outline-none rounded-md focus:ring-1 ring-cyan-500"/>
                    </>
                    }
                    { !register &&
                        <>
                            <button
                                className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold text-lg">Entrar
                            </button>
                            <a className="text-blue-400 text-center my-2">Esqueci minha senha</a>
                            <hr/>
                        </>
                    }
                    <button
                        className="w-full bg-green-400 mt-8 mb-4 text-white p-3 rounded-lg font-semibold text-lg">
                        Criar nova conta
                    </button>
                </form>
                <p className="text-center text-sm my-4">
                    <span className="font-semibold text-center w-full">Create a Page</span> for a celebrity, band or
                    business
                </p>
            </div>
        </div>
    );
}

export default Login;
