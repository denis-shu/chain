const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
const {
    INIT_BALANCE
} = require('../config');

class Wallet {
    constructor() {
        this.balance = INIT_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet - 
        publicKEy: ${this.publickKey.toString()}
        balance :${this.balance}
        `
    }
    signOn(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool) {
        this.balance = this.calculateBalance(blockchain);

        if (amount > this.balance) {
            console.log(`${amount} gt th balance ${this.balance}`);
            return;
        }
        let transaction = transactionPool.existinTransaction(this.publicKey);

        if (transaction) {
            transaction.update(this, recipient, amount);
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    calculateBalance(blockchain) {
        console.log(blockchain);
        let balance = this.balance;
        let transactions = [];
        blockchain.chain.forEach(element => element.data.forEach(t => {
            transactions.push(t);
        }));

        const walletInputs = transactions.filter(s => s.input.address === this.publicKey);

        let start = 0;

        if (walletInputs.length > 0) {
            const recentInputT = walletInputs.reduce(
                (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
            );

            balance = recentInputT.outputs.find(o => o.address === this.publicKey).amount;
            start = recentInputT.input.timestamp;
        }

        transactions.forEach(t => {
            if (t.input.timestamp > start) {
                t.outputs.find(o => {
                    if (o.address === this.publicKey) {
                        balance += o.amount;
                    }
                });
            }
        });
        return balance;
    }

    static blockchainW() {
        const blockchainW = new this();
        blockchainW.address = 'blockchain-w';
        return blockchainW;
    }

}

module.exports = Wallet;