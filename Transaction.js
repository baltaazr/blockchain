class Transaction {
  constructor(sender, receiver, amount) {
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
  }

  get json() {
    return JSON.stringify(this);
  }
}

module.exports = Transaction;
