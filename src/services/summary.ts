import getObjectAsJsonString from "../io/object_as_json_string";
import { TimeFrame } from "../types/cli";
import { MonthSummaryDTO, SummaryDTO, YearSummaryDTO } from "../types/dtos";
import { Transaction, TransactionType } from "../types/ledger_file";
import {
  getExpenseAccGroupedByAsset,
  getIncomingAccGroupedByAsset,
} from "./generic/accumulators";
import {
  isExpenseFilter,
  isIncomeFilter,
  isMonthAndYearFilter,
} from "./generic/filters";

function getMonthSummary(
  data: Transaction[],
  year: number,
  month: number,
  type: TransactionType
) {
  const monthSummary: MonthSummaryDTO = {
    month: month.toString(),
    balance: 0,
  };
  if (type === TransactionType.EXPENSE) {
    monthSummary.children = expenseByMonth(data, month, year);
  } else if (type === TransactionType.INCOME) {
    monthSummary.children = incomeByMonth(data, month, year);
  } else if (type === TransactionType.TRANSFER) {
    monthSummary.children = [
      ...incomeByMonth(data, month, year),
      ...expenseByMonth(data, month, year),
    ];
  }
  if (monthSummary.children) {
    monthSummary.balance = monthSummary.children.reduce(
      (acc, item) => acc + item.balance,
      0
    );
  }
  return monthSummary;
}

export function getSummary(
  data: Transaction[],
  type: TransactionType,
  by: TimeFrame,
  year: number,
  month?: number
): MonthSummaryDTO | YearSummaryDTO {
  if (by === TimeFrame.MONTH) {
    if (!month) throw new Error("Month is required");
    return getMonthSummary(data, year, month, type);
  } else {
    let max_month = 12;
    if (year === new Date().getFullYear()) {
      max_month = new Date().getMonth() + 1;
    }
    const yearSummary: YearSummaryDTO = {
      year: year.toString(),
      balance: 0,
      children: [],
    };
    for (let m = 0; m < max_month; m++) {
      const monthSummary: MonthSummaryDTO = getMonthSummary(
        data,
        year,
        m,
        type
      );
      yearSummary.children?.push(monthSummary);
    }
    if (yearSummary.children) {
      yearSummary.balance = yearSummary.children.reduce(
        (acc, item) => acc + item.balance,
        0
      );
    }
    return yearSummary;
  }
}

function incomeByMonth(
  data: Transaction[],
  month: number,
  year: number
): SummaryDTO[] {
  const filteredData = data
    .filter(isIncomeFilter)
    .filter((item) => isMonthAndYearFilter(item, month, year));

  return getIncomingAccGroupedByAsset(filteredData);
}

function expenseByMonth(
  data: Transaction[],
  month: number,
  year: number
): SummaryDTO[] {
  const filteredData = data
    .filter(isExpenseFilter)
    .filter((item) => isMonthAndYearFilter(item, month, year));
  return getExpenseAccGroupedByAsset(filteredData);
}
