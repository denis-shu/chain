const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2PServer {
    constructor(blockchain) {
        this.blockchain = blockchain;
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

            this.blockchain.replaceChain(data);
        });
    }

    sendChain(socket) {
        socket.send(JSON.stringify(this.blockchain.chain));

    }

    syncChains() {
        this.sockets.forEach(s => {
            this.sendChain(s);
        });
    }
}

module.exports = P2PServer;