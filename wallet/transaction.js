const ChainUtil = require('../chain-util');

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    update(senderWallet, recipient, amount) {
        this.sendOutput = this.outputs.find(o => o.address == senderWallet.publicKey);

        if (amount > senderWallet.amount) {
            console.log(`amount ${amount} is gr th balance`);
            return;
        }
        this.sendOutput.amount = this.sendOutput.amount - amount;
        this.outputs.push({
            amount: amount,
            address: recipient
        });

        Transaction.signTransaction(this, senderWallet);

        return this;
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