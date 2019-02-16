const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const newBlock = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(newBlock);

        return newBlock;
    }

    isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];
            if (block.lasthash !== lastBlock.hash || block.hash !== Block.blockHash(block))
                return false;
        }
        return true;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length)
            return;
        else if (!this.isValidChain(newChain)) {
            console.log('chain is not valid');
            return;
        }
        console.log('replace chain-newChain');
        this.chain = newChain;
    }
}

module.exports = Blockchain;