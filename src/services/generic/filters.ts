import { Transaction, TransactionType } from "../../types/ledger_file";

export function isExpenseFilter(item: Transaction) {
  return item.type === TransactionType.EXPENSE;
}
export function isIncomeFilter(item: Transaction) {
  return item.type === TransactionType.INCOME;
}

export function isMonthAndYearFilter(
  item: Transaction,
  month: number,
  year: number
) {
  const itemDate = new Date(item.date);
  return itemDate.getMonth() === month && itemDate.getFullYear() === year;
}
