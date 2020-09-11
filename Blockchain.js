const Block = require('./Block');

class Blockchain {
  constructor() {
    this.unconfirmed_transactions = [];
    this.chain = [];
  }

  static get difficulty() {
    return 2;
  }

  load_chain({ unconfirmed_transactions, chain: newChain }) {
    this.unconfirmed_transactions = unconfirmed_transactions;
    this.chain = [];
    for (let i = 0; i < newChain.length; i++) {
      const blockObj = newChain[i];
      const block = new Block();
      block.load_block(blockObj);
      this.chain.push(block);
    }
  }

  create_genesis_block() {
    /*
    A function to generate genesis block and appends it to
    the chain. The block has index 0, previous_hash as 0, and
    a valid hash.
    */
    const genesis_block = new Block(0, [], '0');
    this.chain.push(genesis_block);
  }

  get last_block() {
    return this.chain[this.chain.length - 1];
  }

  get json() {
    return JSON.stringify(this);
  }

  add_block(block) {
    /*
    A function that adds the block to the chain after verification.
    Verification includes:
    * Checking if the proof is valid.
    * The previous_hash referred in the block and the hash of latest block
      in the chain match.
    */
    const previous_hash = this.last_block.compute_hash();
    if (previous_hash !== block.previous_hash) {
      return false;
    }
    if (!Blockchain.is_valid_proof(block)) {
      return false;
    }
    this.chain.push(block);
    return true;
  }

  static proof_of_work(block) {
    block.nonce = 0;
    let computed_hash = block.compute_hash();
    while (!computed_hash.startsWith('0'.repeat(Blockchain.difficulty))) {
      block.nonce += 1;
      computed_hash = block.compute_hash();
    }
    return computed_hash;
  }

  add_new_transaction(transaction) {
    this.unconfirmed_transactions.push(transaction);
  }

  static is_valid_proof(block) {
    /*
        Check if block_hash is valid hash of block and satisfies
        the difficulty criteria.
        */
    return block.compute_hash().startsWith('0'.repeat(Blockchain.difficulty));
  }

  check_chain_validity(chain) {
    let result = true;
    let previous_hash = '0';
    chain.forEach((block) => {
      //remove the hash field to recompute the hash again
      //using `compute_hash` method.
      if (
        !Blockchain.is_valid_proof(block) ||
        previous_hash !== block.previous_hash
      ) {
        result = false;
      }
      previous_hash = block.compute_hash();
    });
    return result;
  }

  mine() {
    /*
    This function serves as an interface to add the pending
    transactions to the blockchain by adding them to the block
    and figuring out Proof Of Work.
    */
    if (this.unconfirmed_transactions.length < 1) {
      return false;
    }
    const last_block = this.last_block;
    const new_block = new Block(
      last_block.index + 1,
      this.unconfirmed_transactions,
      last_block.compute_hash()
    );
    Blockchain.proof_of_work(new_block);
    this.add_block(new_block);
    this.unconfirmed_transactions = [];

    // TODO: Broadcast it to the world
    return new_block;
  }
}

module.exports = Blockchain;
