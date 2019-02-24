const Wallet = require('./index');
const TransPool = require('./transaction-pool');

describe('wallet', () => {
    let wallet, tp;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransPool();
    });

    describe('cr a trsn', () => {
        let transaction, recipient, sendAmount;

        beforeEach(() => {
            sendAmount = 50;
            recipient = '1232-23rf';
            transaction = wallet.createTransaction(recipient, sendAmount, tp);
        });
        describe('same trsn', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp);
            });

            it('doubles the sendAmount', () => {
                expect(transaction.outputs.find(d => d.address === wallet.publicKey).amount)
                    .toEqual(wallet.balance - sendAmount * 2);
            });

            it('clones the output', () => {
                expect(transaction.outputs.filter(d => d.address === recipient)
                    .map(o => o.amount)).toEqual([sendAmount, sendAmount]);
            });
        });
    });
});