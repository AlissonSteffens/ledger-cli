export enum TransactionType {
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
  TRANSFER = "TRANSFER",
}

export type Transaction = {
  date: string;
  description: string;
  to: string;
  amount: number;
  from: string;
  type?: TransactionType;
};
