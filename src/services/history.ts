import { Transaction } from "../types/ledger_file";

export default function getHistory(transactions: Transaction[], limit: number) {
  // get last transactions
  const last_transactions = transactions.slice(-limit);
  return last_transactions;
}
