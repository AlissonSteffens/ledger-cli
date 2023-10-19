import { readFileSync } from "fs";
import { parse } from "yaml";
import { Transaction, TransactionType } from "../types/ledger_file";

export function getLedgerFileAsJson(file_name: string): Transaction[] {
  // read file (UTF16)
  const file = readFileSync(file_name, "utf16le");

  // parse yaml file
  const data = parse(file);

  // organize data in a array of objects (by line)
  const dataArr: Transaction[] = data.split("\n").map((line: string) => {
    // split line by spaces
    const lineArr = line.split(" ");
    // remove empty spaces
    lineArr.forEach((item: string, index: number) => {
      if (item === "") {
        lineArr.splice(index, 1);
      }
    });
    // if more than 5 spaces, join description in one string
    if (lineArr.length > 5) {
      const descriptionArr = lineArr.slice(1, lineArr.length - 4);
      // console.log(descriptionArr);
      const description = descriptionArr.join(" ");
      lineArr.splice(1, lineArr.length - 5, description);
    }
    // remove empty spaces
    lineArr.forEach((item: string, index: number) => {
      if (item === "") {
        lineArr.splice(index, 1);
      }
    });

    // if val has $, remove it
    if (lineArr[3].includes("$")) {
      lineArr[3] = lineArr[3].replace("$", "");
    }
    // as date
    const date = lineArr[0];
    const description = lineArr[1];
    const to = lineArr[2];
    const amount = lineArr[3];
    const from = lineArr[4];

    const type: TransactionType =
      to && to.split(":").length > 1 && to.split(":")[0] === "Assets"
        ? TransactionType.INCOME
        : TransactionType.EXPENSE;

    return { date, description, to, amount, from, type };
  });

  // order by date
  dataArr.sort((a: Transaction, b: Transaction) => {
    const dateA: Date = new Date(a.date);
    const dateB: Date = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return dataArr;
}
