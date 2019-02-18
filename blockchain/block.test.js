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
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
        // console.log(block.toString());
    });

    it('dif', () => {
        // console.log(Block.adjustDifficulty(block, block.timestamp + 360000));
        // console.log('2');
        // console.log(block);
        expect(Block.adjustDifficulty(block, block.timestamp + 360000))
            .toEqual(block.difficulty - 1);
    });

    it('raises', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 1))
            .toEqual(block.difficulty + 1);
    });
});