import React, {Component, useState} from "react";
import '../../styles/home.css'
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import { Link, useHistory } from 'react-router-dom';
import Axios from 'axios';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import {DialogContent} from "@material-ui/core";
import ModalMenu from '../Home/ModalMenu';
import {ToastContainer, toast} from "react-toastify";
import StarBorderIcon from '@material-ui/icons/StarRate';
import Rating from '@material-ui/lab/Rating';
import {configMaos} from "../Cadastro/config-maos";

function Home(props) {
    const [inputPalavra, setInputPalavra] = useState('')
    const [palavra, setPalavra] = useState('');
    const [regiao, setRegiao] = useState('');
    const [sinal, setSinal] = useState('');
    const [show, setShow] = useState(false);
    const [sinaisBd, setSinaisBd] = useState([]);
    const [sinalAtual, setSinalAtual] = useState({});
    const [aval, setAval] = React.useState(0);
    const [hover, setHover] = React.useState(-1);



    const history = useHistory();
    const handleClick = () => {
        history.push('/cadastrar');
    }

    const submitAval = (valor) => {
        Axios.post('http://127.0.0.1:3001/palavra/avaliar', {
            avaliacao: valor,
            sinal: sinalAtual.id_sinal
        }).then((response) => {
            if(response.data.code === 'ER_DUP_ENTRY') {
                toast.error("Você já avaliou esse sinal!");
            } else if (response.data.code === 'Null') {
                toast.error("Tente novamente!");
            } else {
                toast.success("Sinal avaliado com sucesso!");
            }
            console.log(response);
            }
        )
    }

    const submitPalavra = () => {
        setSinalAtual({});
        setSinaisBd([]);
        Axios.get(`http://localhost:3001/grid/palavra/${inputPalavra.toLowerCase()}`)
            .then(response => {

                if (!response.data.length) {
                    setRegiao("");
                    setPalavra("");
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

    const openModal = () => {
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
    }

    const mudaSinalAtual = (value) => {
        setSinalAtual(sinaisBd[parseInt(value, 10)]);
        console.log(value);
    }

    return (
            <div className="superContainer">
                <div className="navigation">

                    <Dialog transitionDuration={{enter: 300, exit: 500}} maxWidth="xs" onClose={handleClose}
                            aria-labelledby="simple-dialog-title" open={show}>
                        <DialogTitle id="simple-dialog-title">
                            <div className="box-dialog" style={{textAlign: 'center'}}>
                                <b style={{fontSize: '35px', color: '#696df6'}}>Menu</b>
                                <hr/>
                            </div>
                        </DialogTitle>
                        <DialogContent>
                           <ModalMenu></ModalMenu>
                        </DialogContent>
                    </Dialog>

                    <span><MenuIcon className="menuBtn" onClick={openModal}/></span>
                    <span className="titleHome">Dicionário Colaborativo de Libras</span>
                    <button onClick={handleClick} className="cadastrarBtn">
                            Cadastre uma palavra <AddIcon/>
                    </button>
                </div>

                <div className="shadow">
                <div className="qry">
                    <div className="palavra">
                        <span className="qryspan">Por Palavra</span>
                        <input onChange={(e) => {
                            setInputPalavra(e.target.value);
                        }} type="text" placeholder="        por palavra..."/>
                        <SearchIcon onClick={submitPalavra} className="searchicon"/>
                    </div>
                    <div className="alfabetica">
                        <span className="qryspan">Por ordem alfabética</span>
                        <input type="text" placeholder="      por ordem alfabética..."/>
                        <SearchIcon className="searchicon"/>
                    </div>
                    <div className="mao">
                        <span className="qryspan">Por configuração de mão</span>
                        <input type="text" placeholder=" por configuração de mão..."/>
                        <SearchIcon className="searchicon"/>
                    </div>
                </div>
                </div>

                <div className="infocontainer">
                    <div className="primeiraColuna">

                            <span className="colTitle">Palavra</span>
                            <hr className="line"/>
                            <div className="divResult">
                                <span className="colResult">{sinalAtual.palavra}</span>
                            </div>

                        <div style={{marginTop: '200px'}}>
                            <span className="colTitle" style={{marginTop: '200px'}}>Ponto de Articulação</span>
                            <hr className="line"/>
                            <div className="divResult">
                                <span className="colResult">{sinalAtual.ponto}</span>
                            </div>
                        </div>

                    </div>

                    <div className="segundaColuna">
                        <span className="colTitle">Sinal</span>
                        <hr className="line"/>
                        {sinaisBd.length ? (
                            <div style={{marginLeft: '5px'}}>
                                <div style={{marginTop: '10px', marginBottom: '10px'}}>
                                    <span style={{fontFamily: 'Alata, sans-serif', fontSize: '18px', marginRight: '10px'}}>Sinal Atual:</span>
                                    <select
                                        onChange={(e) => mudaSinalAtual(e.target.value)} style={{width: '150px'}}>
                                    {sinaisBd.map((s, idx) => (
                                        <option key={idx} value={idx}>{idx + 1}:  {s.palavra} - {s.regiao}</option>
                                    ))}
                                    </select>

                                </div>
                                <div>
                                    <span style={{fontFamily: 'Alata, sans-serif', fontSize: '18px', marginRight: '10px'}}>Avaliação Média:
                                    </span>
                                    <span>
                                        {sinalAtual.avaliacao ? sinalAtual.avaliacao.toFixed(2)  : 'Sem Avaliações'}<StarBorderIcon fontSize={"large"} style={{color: '#ffb400'}}/>
                                    </span>
                                </div>
                                <div>
                                    <span style={{fontFamily: 'Alata, sans-serif', fontSize: '18px'}}>
                                    Avalie o Sinal:
                                     <Rating
                                         style={{top: '5px', left: '5px'}}
                                         name="hover-feedback"
                                         value={aval}
                                         precision={0.5}
                                         onChange={(event, newValue) => {
                                             setAval(newValue);
                                             submitAval(newValue);
                                         }}
                                         onChangeActive={(event, newHover) => {
                                             setHover(newHover);
                                         }}
                                     />
                                    </span>
                                </div>

                            </div>
                        ) : ''}
                        <div className="divResult">
                            {/*<span className="colResult">{sinal}</span>*/}

                            { sinaisBd.length ? (
                                <div style={{marginTop: '20px'}}>
                                    <React.Fragment key={sinalAtual.id_sinal}>
                                        <video
                                            width="750" height="350"
                                            src={"./sinais/" + sinalAtual.caminho}
                                            controls="controls">
                                        </video>
                                    </React.Fragment>
                                </div>
                            ) : ''
                            }
                        </div>
                    </div>

                    <div className="terceiraColuna">
                            <span className="colTitle">Região</span>
                            <hr className="line"/>
                            <div className="divResult">
                                <span className="colResult">{sinalAtual.regiao}</span>
                            </div>

                        <div style={{marginTop: '170px'}}>
                            <span className="colTitle" style={{marginTop: '200px'}}>Configuração de Mão</span>
                            <hr className="line"/>
                            <div style={{display: 'flex', marginTop: '30px', marginLeft: '80px'}}>
                                {
                                    sinalAtual.config ? sinalAtual.config.split(',').map(config => (
                                        // <div style={{marginLeft: '20px'}}>
                                            <img
                                                style={{width: '100px'}}
                                                // className=" border-2 border-solid border-white hover:border-indigo-500 cursor-pointer"
                                                src={'./config-maos/' + config + '.jpg'} alt={config.value}/>
                                        // </div>


                                    )) : ''
                                }
                            </div>
                        </div>
                    </div>
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

export default Home;
