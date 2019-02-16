const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2PServer = require('./p2p');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const p2pServer = new P2PServer(bc);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

app.post('/mine', (req, res) => {
    const blokc = bc.addBlock(req.body.data);
    console.log(`new block add ${blokc.toString()}`);
    p2pServer.syncChains();
    res.redirect('/blocks');
});




app.listen(HTTP_PORT, () => console.log(`its ok. Port ${HTTP_PORT}`));
p2pServer.listen();