const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {
    let bc;
    let bc1;

    beforeEach(() => {
        bc = new Blockchain();
        bc1 = new Blockchain();
    });

    it('start with gen block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis())
    });

    it('add a new blck', () => {
        const data = 'data';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
    });

    it('validate', () => {
        bc1.addBlock('first');

        expect(bc.isValidChain(bc1.chain)).toBe(true);

    });
    it('validate false', () => {
        bc1.chain[0].data = "wrong";

        expect(bc.isValidChain(bc1.chain)).toBe(false);

    });

    it('validate if Defect', () => {
        bc1.addBlock('block');
        bc1.chain[1].data = 'block1';

        expect(bc.isValidChain(bc1.chain)).toBe(false);
    });

    it('replace chain', () => {
        bc1.addBlock('block');
        bc.replaceChain(bc1.chain);

        expect(bc.chain).toEqual(bc1.chain);
    });

    it('not replace chain', ()=>{
        bc.addBlock('block');
        bc.replaceChain(bc1.chain);

        expect(bc.chain).not.toEqual(bc1.chain);
    })
});