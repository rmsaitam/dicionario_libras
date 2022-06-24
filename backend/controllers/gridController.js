const express = require('express');
const router = express.Router();
const config = require('../config/config.json');
const mysql = require('mysql');

const db = mysql.createConnection({
    user: config.user,
    host: config.host,
    password: config.password,
    database: config.database
})

router.get("/palavras", (req, res) => {
    db.query("select p.palavra, s.id_sinal, s.avaliacao, r.uf_regiao, c.id_config, pnt.nome_ponto, s.caminho " +
        "from palavra p, sinal s, sinal_regiao sr, regiao r, config c, sinal_config sc, sinal_ponto sp, ponto pnt " +
        "where #s.id_palavra = p.id_palavra " +
        "sr.id_sinal = s.id_sinal " +
        "and sr.id_regiao = r.id_regiao " +
        "and sc.id_sinal = s.id_sinal " +
        "and sc.id_config = c.id_config " +
        "and sp.id_sinal = s.id_sinal " +
        "and sp.id_ponto = pnt.id_ponto_artic " +
        "and s.status = 0 " +
        "order by id_sinal;", (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.get("/palavra/:nome", (req, res) => {
    const nome = req.params.nome;
    db.query("select p.palavra, s.id_sinal, s.media_avaliacao, r.uf_regiao, c.id_config, pnt.nome_ponto, s.caminho " +
        "from palavra p, sinal s, sinal_regiao sr, regiao r, config c, sinal_config sc, sinal_ponto sp, ponto pnt " +
        "where s.id_palavra = p.id_palavra" +
        " and sr.id_sinal = s.id_sinal" +
        " and sr.id_regiao = r.id_regiao" +
        " and sc.id_sinal = s.id_sinal" +
        " and sc.id_config = c.id_config" +
        " and sp.id_sinal = s.id_sinal" +
        " and sp.id_ponto = pnt.id_ponto_artic" +
        " and p.palavra = ? " +
        " order by id_sinal ", nome, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

module.exports = router;