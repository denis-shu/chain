const TransactionPool = require('./transaction-pool');

const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Tpool', () => {
    let tp, wallet, transaction;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();

        transaction = Transaction.newTransaction(wallet, 'sads-234fs', 22);

        tp.updateOrAddTransaction(transaction);
    });

    it('add to pool', () => {
        expect(tp.transactions[0]).toEqual(transaction);
    });

    it('same', () => {
        expect(tp.transactions.find(s => s.id == transaction.id)).toEqual(transaction);
    })

    it('update', () => {
        const old = JSON.stringify(transaction);
        const newT = transaction.update(wallet, '21dfaf-234r', 33);

        tp.updateOrAddTransaction(newT);

        expect(JSON.stringify(tp.transactions.find(s => s.id === newT.id)))
            .not.toEqual(old);
    })

});