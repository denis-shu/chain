const ChainUtil = require('../chain-util');

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    static newTransaction(senderWallet, recipient, amount) {
        const transaction = new this();

        if (amount > senderWallet.balance) {
            console.log(`ops, ${amount} gr;th balance.`);
            return;
        }

        transaction.outputs.push(...[{
                amount: senderWallet.balance - amount,
                address: senderWallet.publicKey
            },
            {
                amount,
                address: recipient
            }
        ])

        Transaction.signTransaction(transaction, senderWallet);

        return transaction;
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.signOn(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTr(transaction) {
        // console.log("2",ChainUtil.hash(transaction.outputs));
        // console.log("2", transaction.input);
        return ChainUtil.verifySig(
            transaction.input.address,
            transaction.input.signature,
           
            ChainUtil.hash(transaction.outputs)
        );
    }
}

module.exports = Transaction;