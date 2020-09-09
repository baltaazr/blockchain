const fs = require('fs');

module.exports = (blockchain) => {
  fs.writeFile('blockchain.json', blockchain.json, (err) => {
    if (err) throw err;
    console.log('Your blockchain has been saved.');
  });
};
