const Blockchain = require('./blockchain');

const b = new Blockchain(); 

for(let i=0; i<10; i++){
    console.log(b.addBlock(`fa ${i}`).toString());
}

