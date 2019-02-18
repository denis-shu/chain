const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require("crypto-js/sha256");

const uuidV1 = require('uuid/v1');

class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
    }

    static id() {
        return uuidV1();
    }

    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySig(publicKey, signature, dataHash) {
        let res = ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);   // console.log("1",res);
        // console.log("1",signature);
        // console.log("1",dataHash);
        
       // let dd = res.verify(dataHash, signature);

        return res;
    }
}

module.exports = ChainUtil;