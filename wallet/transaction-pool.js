const Transaction = require('../wallet/transaction');

class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        let transactionId = this.transactions.find(t => t.id === transaction.Id);

        if (transactionId) {
            this.transactions[this.indexOf(transactionId)] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    existinTransaction(address) {
        return this.transactions.find(f => f.input.address === address);
    }

    validTransaction() {
        return this.transactions.filter(transaction => {
            const outputTotal = transaction.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0);
            if (transaction.input.amount != outputTotal) {
                console.log(`invalid from ${transaction.input.address}`);
                return;
            }
            if (!Transaction.verifyTr(transaction)) {
                console.log(`invalid ${transaction.input.address}`);
                return;
            }
            return transaction;
        });
    }

    clear() {
        this.transactions = [];
    }

}

module.exports = TransactionPool;