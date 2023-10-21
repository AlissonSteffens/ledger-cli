export type SummaryDTO = {
  asset: string;
  balance: number;
  children?: SummaryDTO[];
};

export type MonthSummaryDTO = {
  month: string;
  balance: number;
  children?: SummaryDTO[];
};

export type YearSummaryDTO = {
  year: string;
  balance: number;
  children?: MonthSummaryDTO[];
};

export type assetBalance = { [key: string]: number };
