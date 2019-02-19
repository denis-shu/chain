class TrasactionPool {
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

}

module.exports = TrasactionPool;