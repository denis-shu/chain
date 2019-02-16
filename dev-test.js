const Block = require('./block');

const fBlock = Block.mineBlock(Block.genesis(), 'fake');

console.log(fBlock.toString());