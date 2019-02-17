const {
    INIT_BALANCE
} = require('../config');

class Wallet {
    constructor() {
        this.balance = INIT_BALANCE;
        this.keyPair = null;
        this.publickKey = null;
    }

    toString() {
        return `Wallet - 
        publicKEy: ${this.publickKey.toString()}
        balance :${this.balance}
        `
    }

}

module.exports = Wallet;