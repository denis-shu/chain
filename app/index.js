const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2PServer = require('./p2p');
const Wallet = require('../wallet');
const TrPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const tp = new TrPool();
const wallet = new Wallet();
const p2pServer = new P2PServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);


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

app.get('/mine-transactions', (req, res)=>{
    const block = miner.mine();
    console.log(`new b added ${block.toString()}`);

    res.redirect('/blocks');
});


app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
});

app.post('/transact', (req, res) => {
    const {
        recipient,
        amount
    } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, bc, tp);
    p2pServer.syncTransaction(transaction);
    res.redirect('./transactions');
});


app.get('/publicKey', (req, res) => {
    res.json({
        publicKey: wallet.publicKey
    })
});

app.listen(HTTP_PORT, () => console.log(`its ok. Port ${HTTP_PORT}`));
p2pServer.listen();