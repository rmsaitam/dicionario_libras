import React, {Component, useEffect, useState} from "react";
import {configMaos} from "./config-maos";
import '../../styles/modal-config.css'
import 'react-toastify/dist/ReactToastify.css';
import {Button} from "@material-ui/core";



function ModalConfigMaos(props) {

useEffect(() => {
    console.log(configMaos);
})
    return (
        <div className="flex flex-wrap gap-15">
            {
                configMaos.map(config => (
                        <div>
                            <img
                                className=" border-2 border-solid border-white hover:border-indigo-500 cursor-pointer"
                                src={config.url} alt={config.value} onClick={(e) => props.onClickConfig(e.target.alt)}/>
                        </div>


                ))
            }
        </div>
    );


};

export default ModalConfigMaos;
