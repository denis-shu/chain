const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const MSG_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clearTRansactions: 'CLEAR_TRANSACTIONS'
};

class P2PServer {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }

    listen() {
        const server = new WebSocket.Server({
            port: P2P_PORT
        });
        server.on('connection', socket => this.connectionSocket(socket));

        this.connectToPeers();

        console.log(`listening p2p on: ${P2P_PORT}`);

    }

    connectToPeers() {
        peers.forEach(p => {
            const socket = new WebSocket(p);

            socket.on('open', () => this.connectionSocket(socket));
        });
    }

    connectionSocket(socket) {
        this.sockets.push(socket);
        console.log('socket connected');

        this.messageHandler(socket);

        this.sendChain(socket);
    }

    messageHandler(socket) {
        socket.on('message', m => {
            const data = JSON.parse(m);

            switch (data.type) {
                case MSG_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MSG_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MSG_TYPES.clearTRansactions:
                    this.transactionPool.clear();
                    break;
            }

        });
    }

    sendChain(socket) {
        socket.send(JSON.stringify({
            type: MSG_TYPES.chain,
            chain: this.blockchain.chain
        }));

    }

    syncChains() {
        this.sockets.forEach(s => {
            this.sendChain(s);
        });
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type: MSG_TYPES.transaction,
            transaction
        }));
    }

    syncTransaction(transaction) {
        this.sockets.forEach(s => this.sendTransaction(s, transaction));
    }

    syncClear() {
        this.sockets.forEach(s => s.send(JSON.stringify({
            type: MSG_TYPES.clearTRansactions
        })));
    }
}

module.exports = P2PServer;