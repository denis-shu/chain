const Transaction = require("./transaction");
const Wallet = require("./index");

describe("Trans", () => {
    let transaction, wallet, recipient, amount;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = "qwertyu";
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it("outupt subsctracted", () => {
        // console.log(transaction);
        // console.log(wallet);
        expect(
            transaction.outputs.find(output => output.address === wallet.publicKey)
            .amount
        ).toEqual(wallet.balance - amount);
    });

    it("outs added to recipient", () => {
        expect(
            transaction.outputs.find(o => o.address === recipient).amount
        ).toEqual(amount);
    });

    it("input balance", () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it("validate trnsct", () => {
        console.log("T", transaction);
        expect(Transaction.verifyTr(transaction)).toBe(true);
    });

    it("not valid trsc", () => {
        transaction.outputs[0].amount = 12345;
        expect(Transaction.verifyTr(transaction)).toBe(false);
    });

    describe("trans with excedded am", () => {
        beforeEach(() => {
            amount = 12345;
            transaction = Transaction.newTransaction(wallet, recipient, amount);
        });
        it("not chreate", () => {
            expect(transaction).toEqual(undefined);
        });
    });


    describe("update trsc", () => {
        let nextAmout, nextRecipient;

        beforeEach(() => {
            nextAmout = 22;
            nextRecipient = 'as8d89-asdaf1';
            transaction = transaction.update(wallet, nextRecipient, nextAmout);

        });

        it('nextA', () => {
            expect(transaction.outputs.find(s => s.address === wallet.publicKey)
                .amount).toEqual(wallet.balance - amount - nextAmout);
        });

        it('next rec', () => {
            expect(transaction.outputs.find(s => s.address === nextRecipient).amount)
                .toEqual(nextAmout);
        });
    });
});