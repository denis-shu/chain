const Wallet = require("./index");
const TransPool = require("./transaction-pool");
const Blockchain = require("../blockchain");
const {
    INIT_BALANCE
} = require("../config");

describe("wallet", () => {
    let wallet, tp, bc;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransPool();
        bc = new Blockchain();
    });

    describe("cr a trsn", () => {
        let transaction, recipient, sendAmount;

        beforeEach(() => {
            sendAmount = 50;
            recipient = "1232-23rf";
            transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
        });
        describe("same trsn", () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bc, tp);
            });

            it("doubles the sendAmount", () => {
                expect(
                    transaction.outputs.find(d => d.address === wallet.publicKey).amount
                ).toEqual(wallet.balance - sendAmount * 2);
            });

            it("clones the output", () => {
                // console.log("cc", transaction);
                expect(
                    transaction.outputs
                    .filter(d => d.address === recipient)
                    .map(o => o.amount)
                ).toEqual([sendAmount, sendAmount]);
            });
        });
    });

    describe("get a balance", () => {
        let addBalance, repeatAdd, senWallet;
        beforeEach(() => {
            senWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;
            for (let i = 0; i < repeatAdd; i++) {
                senWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
            }
            bc.addBlock(tp.transactions);
        });
        it("get a balance for blockchain transs", () => {
            expect(wallet.calculateBalance(bc)).toEqual(
                INIT_BALANCE + (addBalance * repeatAdd)
            );
        });

        it("matching the sender", () => {
            expect(senWallet.calculateBalance(bc)).toEqual(
                INIT_BALANCE - (addBalance * repeatAdd)
            );
        });


        describe('recipient has a trsnts', () => {
            let subsctract, recipientBalance;
            beforeEach(() => {
                tp.clear();
                subsctract = 55;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senWallet.publicKey, subsctract, bc, tp);
                bc.addBlock(tp.transactions);
            });

            describe('send another trnsts to rec', () => {
                beforeEach(() => {
                    tp.clear();
                    senWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
                    bc.addBlock(tp.transactions);
                });

                it('get rec balance', () => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subsctract + addBalance);
                });
            });
        });
    });
});