const Wallet = require('./index');
const TransPool = require('./transaction-pool');
const Blockchain = require('../blockchain');


describe('wallet', () => {
    let wallet, tp, bc;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransPool();
        bc= new Blockchain();
    });

    describe('cr a trsn', () => {
        let transaction, recipient, sendAmount;

        beforeEach(() => {
            sendAmount = 50;
            recipient = '1232-23rf';
            transaction = wallet.createTransaction(recipient, sendAmount,bc, tp);
        });
        describe('same trsn', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bc, tp);
            });

            it('doubles the sendAmount', () => {
                expect(transaction.outputs.find(d => d.address === wallet.publicKey).amount)
                    .toEqual(wallet.balance - sendAmount * 2);
            });

            it('clones the output', () => {
                console.log('cc', transaction);
                expect(transaction.outputs.filter(d => d.address === recipient)
                    .map(o => o.amount)).toEqual([sendAmount, sendAmount]);
            });
        });
    });
});