import { Transaction } from "../types/ledger_file";

/**
 * This function retrieves the most recent transactions from a list of transactions.
 *
 * @param transactions - An array of Transaction objects. Each transaction object represents a single transaction.
 * @param limit - A number representing the maximum number of recent transactions to retrieve.
 *
 * @returns An array of Transaction objects, representing the most recent transactions. The transactions are returned in reverse chronological order, with the most recent transaction first.
 *
 * @example
 *
 * const transactions = [
 *   { id: 1, from: 'Alice', to: 'Bob', amount: 100 },
 *   { id: 2, from: 'Bob', to: 'Charlie', amount: 200 },
 *   { id: 3, from: 'Charlie', to: 'Alice', amount: 300 },
 * ];
 *
 * const history = getHistory(transactions, 2);
 *
 * console.log(history);
 * // Output:
 * // [
 * //   { id: 3, from: 'Charlie', to: 'Alice', amount: 300 },
 * //   { id: 2, from: 'Bob', to: 'Charlie', amount: 200 },
 * // ]
 */
export default function getHistory(transactions: Transaction[], limit: number) {
  // get last transactions
  const last_transactions = transactions.slice(-limit);
  // return list reversed
  return last_transactions.reverse();
}
