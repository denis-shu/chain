const TransactionPool = require('./transaction-pool');

const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('Tpool', () => {
    let tp, wallet, transaction, bc;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        bc = new Blockchain();
        // transaction = Transaction.newTransaction(wallet, 'sads-234fs', 22);

        // tp.updateOrAddTransaction(transaction);
        transaction = wallet.createTransaction('sads-234fs', 30, bc, tp);
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
    });

    it('clear', () => {
        tp.clear();
        expect(tp.transactions).toEqual([]);
    });

    describe('mixing valid and corrupt', () => {
        let validTransactions;

        beforeEach(() => {
            validTransactions = [
                ...tp.transactions
            ];

            for (let i = 0; i < 6; i++) {
                wallet = new Wallet();
                transaction = wallet.createTransaction('24dsd-de2', 30, bc, tp);
                if (i % 2 == 0) {
                    transaction.input.amount = 12345;
                } else {
                    validTransactions.push(transaction);
                }
            }
        });
        it('show difference v and c', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });
        it('valid tr', () => {
            expect(tp.validTransaction()).toEqual(validTransactions);
        });
    });
});