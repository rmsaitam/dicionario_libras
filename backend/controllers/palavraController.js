const express = require('express');
const config = require('../config/config.json');
const router = express.Router();
const mysql = require('mysql');
const fs = require('fs');
const multer = require('multer');
const multerConfig = require('../config/multer');
const {v4 : uuidv4} = require('uuid')


const db = mysql.createConnection({
    user: config.user,
    host: config.host,
    password: config.password,
    database: config.database
})

router.post("/avaliar", (req, res) => {
    const avaliacao = req.body.avaliacao;
    const sinal = req.body.sinal;
    // receber id do usuario

    if (avaliacao && sinal) {
        db.query('insert into avalia_sinal (id_usuario, id_sinal, nota) ' +
            'values (?, ?, ?)', [1, sinal, avaliacao], (err,result) => {
            if (err) {
                res.send(err);
                console.log("erro avalia sinal");
            } else {
                db.query('UPDATE sinal ' +
                    'set avaliacao = avaliacao + ?, ' +
                    'qt_avaliacao = qt_avaliacao + 1, ' +
                    'media_avaliacao = avaliacao/qt_avaliacao ' +
                    'where id_sinal = ?', [avaliacao, sinal], (err, result) => {
                    if (err) {
                        res.send(err)
                        console.log("Erro avaliacao", err);
                    } else {
                        res.send(result);
                        console.log("Sucesso avaliacao! ");
                    }
                });
            }
        });
    } else {
        res.send({
            code: 'Null'
            })
    }

    console.log(avaliacao, sinal);
})

router.post("/cadastrar", (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    const palavra = req.body.palavra;
    const regiao = req.body.regiao;
    const config = req.body.config;
    const pontoArtic = req.body.pontoArtic;
    const caminho = req.body.caminho;

    const idSinal = getRandomInt(10000, 99999);
    const idUsuario = getRandomInt(10000, 99999);
    const idPalavra = getRandomInt(10000, 99999);
    const idConfig = getRandomInt(10000, 99999);
    const idRegiao = getRandomInt(10000, 99999);
    const idPonto = getRandomInt(10000, 99999);

    const erros = [];
    const sucessos = [];

    console.log(palavra, regiao, config, pontoArtic, caminho);

    db.query('INSERT INTO palavra (id_palavra , id_usuario_criacao, palavra) ' +
        'VALUES (?, ?, ?) ', [idPalavra, 1, palavra], (err, result) => {
        if (err) {
            erros.push(err)
            console.log("erro palavra", err)
        } else {
            sucessos.push(result);
            console.log("successo palavra", result)
        }
    });


    db.query('INSERT INTO sinal (id_sinal , id_usuario, avaliacao, status, caminho) VALUES (?, ?, ?, ?, ?) ',
        [idSinal, 1, 0, 0, caminho ? caminho : ''], (err, result) => {
        if (err) {
            erros.push(err)
            console.log("erro sinal", err)
        } else {
            sucessos.push(result);
            console.log("successo sinal", result)

        }
    });


    const configs = config.split(",")
    configs.forEach((c) => {
        db.query('INSERT INTO sinal_config (id_config , id_sinal) ' +
            'VALUES (?, ?) ', [parseInt(c, 10), idSinal], (err, result) => {
            if (err) {
                erros.push(err)
                console.log("erro sinal config", err)

            } else {
                sucessos.push(result);
                console.log("successo sinal config", result)
            }
        });
    })

    const regioes = regiao.split(",")
    regioes.forEach((r) => {
        db.query('INSERT INTO sinal_regiao (id_regiao , id_sinal) ' +
            'VALUES (?, ?) ', [r, idSinal], (err, result) => {
            if (err) {
                erros.push(err)
                console.log("erro sinal regiao", err)

            } else {
                sucessos.push(result);
                console.log("successo sinal regiao", result)
            }
        });
    })


    const pontos = pontoArtic.split(",")
    pontos.forEach((p) => {
        db.query('INSERT INTO sinal_ponto (id_ponto , id_sinal) ' +
            'VALUES (?, ?) ', [p, idSinal], (err, result) => {
            if (err) {
                erros.push(err)
                console.log("erro sinal ponto", err)

            } else {
                sucessos.push(result);
                console.log("successo sinal ponto", result)
            }
        });
    })


    if (erros.length) {
        res.send(erros);
    } else {
        res.send(sucessos);
    }


});

router.post("/upload",  multer(multerConfig).single('file'), (req, res) => {
    console.log(req.file, " asaasdasdsadasdadsa");
    console.log(req.body);
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = router;