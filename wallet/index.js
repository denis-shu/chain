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

    createTransaction(recipient, amount, transactionPool) {
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

}

module.exports = Wallet;