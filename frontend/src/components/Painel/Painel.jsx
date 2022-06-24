import React, {Component, useEffect, useState} from "react";
import '../../App.css';
import 'react-toastify/dist/ReactToastify.css';
import Axios from "axios";
import {ToastContainer, toast} from "react-toastify";


function Painel(props) {

    const [sinaisBd, setSinaisBd] = useState([]);
    const [sinalAtual, setSinalAtual] = useState({});

    const buscarRegistros = () => {
        setSinalAtual({});
        setSinaisBd([]);
        Axios.get(`http://localhost:3001/grid/palavras/`)
            .then(response => {

                if (!response.data.length) {

                    toast.error("Sem registros no Dicionário!!");
                    return;
                }

                console.log("Resposta::::::::", response);

                const sinais = [];
                let avaliacao = '';
                let caminho = '';
                let regioes = [];
                let pts = [];
                let configs = [];
                let idAtual = response.data[0]['id_sinal'];
                response.data.forEach((resp, idx) => {

                    if (resp['id_sinal'] === idAtual) {
                        if (!regioes.includes(resp['uf_regiao'])) {
                            regioes.push(resp['uf_regiao']);
                        }

                        if (!pts.includes(resp['nome_ponto'])) {
                            pts.push(resp['nome_ponto']);
                        }

                        if (!configs.includes(resp['id_config'])) {
                            configs.push(resp['id_config']);
                        }

                        if (caminho === '') {
                            caminho = resp.caminho;
                        }

                        if (avaliacao === '') {
                            avaliacao = resp['media_avaliacao'];
                        }

                        if (response.data.length === idx +1) {
                            sinais.push({
                                id_sinal: idAtual,
                                palavra: resp.palavra,
                                regiao: regioes.join(","),
                                ponto: pts.join(","),
                                config: configs.join(","),
                                caminho: resp.caminho,
                                avaliacao: resp['media_avaliacao']
                            });
                        }

                    } else {
                        console.log(regioes);
                        sinais.push({
                            id_sinal: idAtual,
                            palavra: resp.palavra,
                            regiao: regioes.join(","),
                            ponto: pts.join(","),
                            config: configs.join(","),
                            caminho: caminho,
                            avaliacao: avaliacao
                        });

                        idAtual = resp['id_sinal'];
                        regioes = []; pts = []; configs = []; avaliacao = ''; caminho = '';
                        regioes.push(resp['uf_regiao']);
                        pts.push(resp['nome_ponto']);
                        configs.push(resp['id_config']);
                        avaliacao = resp['media_avaliacao'];
                        caminho = resp.caminho;

                        if (response.data.length === idx +1) {
                            sinais.push({
                                id_sinal: idAtual,
                                palavra: resp.palavra,
                                regiao: regioes.join(","),
                                ponto: pts.join(","),
                                config: configs.join(","),
                                caminho:  resp.caminho,
                                avaliacao: resp['media_avaliacao']
                            });
                        }
                    }
                })
                console.log(sinais);

                toast.success(sinais.length + " sinais encontrados!!")
                setSinalAtual(sinais[0]);
                setSinaisBd(sinais);
            })
    }

    const aceitaSinal = () => {
        // Axios.post().then(() => {
        // })
        toast.success("Sinal aceito com sucesso!");

    }

    const recusaSinal = () => {
        // Axios.post().then(() => {
        // })
        toast.success("Sinal recusado com sucesso!");
    }

    return (
        <div className="text-gray-900 bg-gray-200">
            <div className="p-4 flex">
                <h1 className="text-3xl">
                    Painel Administrador
                </h1>
                <button
                    onClick={() => buscarRegistros()}
                    type="button"
                    className="ml-4 mr-3 text-md bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Buscar Registros
                </button>
            </div>
            <div className="px-3 py-4 flex justify-center">
                <table className="w-full text-md bg-white shadow-md rounded mb-4">
                    <tbody>
                    <tr className="border-b">
                        <th className="text-left p-3 px-5">Palavra</th>
                        <th className="text-left p-3 px-5">Config. de Mão</th>
                        <th className="text-left p-3 px-5">Ponto de Artic.</th>
                        <th className="text-left p-3 px-5">Região</th>
                        <th className="text-left p-3 px-5">Vídeo</th>

                        <th></th>
                    </tr>
                    {
                        sinaisBd.map( (s) =>
                        (<tr className="border-b hover:bg-orange-100 bg-gray-100">
                            <td className="p-3 px-5">{s.palavra}</td>
                            <td className="p-3 px-5">
                                {s.config ? s.config.split(',').map(config => (
                                    // <div style={{marginLeft: '20px'}}>
                                    <img
                                        style={{width: '100px'}}
                                        // className=" border-2 border-solid border-white hover:border-indigo-500 cursor-pointer"
                                        src={'./config-maos/' + config + '.jpg'} alt={config.value}/>
                                    // </div>


                                )) : ''}
                            </td>
                            <td className="p-3 px-5">{s.ponto}</td>
                            <td className="p-3 px-5">{s.regiao}</td>
                            <td className="p-3 px-5">
                                <div style={{marginTop: '20px'}}>
                                    <React.Fragment key={s.id_sinal}>
                                        <video
                                            width="400" height="350"
                                            src={"./sinais/" + s.caminho}
                                            controls="controls">
                                        </video>
                                    </React.Fragment>
                                </div>
                            </td>
                            <td className="p-3 px-5 flex justify-end">
                                <button
                                    onClick={() => aceitaSinal(s.id_sinal)}
                                    type="button"
                                    className="mt-6 mr-3 text-lg bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Aceitar
                                </button>
                                <button
                                    onClick={() => recusaSinal(s.id_sinal)}
                                    type="button"
                                    className="mt-6 text-lg bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Recusar
                                </button>
                            </td>
                        </tr>))
                    }

                    </tbody>
                </table>
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>


    );
}

export default Painel;
