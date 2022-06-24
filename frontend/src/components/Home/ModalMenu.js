import React, {Component, useState} from "react";
import '../../styles/modal-menu.css'
import 'react-toastify/dist/ReactToastify.css';
import AccountIcon from '@material-ui/icons/AccountCircle';
import AdmIcon from '@material-ui/icons/SupervisorAccountRounded';
import {useHistory} from "react-router-dom";


function ModalMenu(props) {
    const history = useHistory();
    const openLogin = () => {
        history.push('/login');
    }

    const openPainel = () => {
        history.push('/painel');
    }

    return (
        <div className="menu-container">
            <div className="login">
                <button onClick={openLogin} className="loginBtn">
                    <AccountIcon />
                    <span>Acessar</span>
                </button>
            </div>

            <div className="painel">
                <button onClick={openPainel} className="painelBtn">
                    <AdmIcon />
                    <span>Painel Adm</span>
                </button>
            </div>
        </div>
    );


};

export default ModalMenu;
