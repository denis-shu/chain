const Block = require('./block');

const {
    DIFFICULTY
} = require('../config');

describe('Block', () => {

    let data, lastBlock, block;
    beforeEach(() => {
        data = 'data';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);

    });
    it('sets the `data` to match the input', () => {
        expect(block.data).toEqual(data)
    });

    it('sets the `lastHash` to mathc the hash of last block', () => {
        expect(block.lasthash).toEqual(lastBlock.hash);
    });


    it('generate hash', () => {
        expect(block.hash.substring(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
        console.log(block.toString());
    });
});