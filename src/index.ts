import { getLedgerFileAsJson } from "./io/file_reader";
import getObjectAsJsonString from "./io/object_as_json_string";
import getHistory from "./services/history";
import { getSummary } from "./services/summary";
import { ProcessType, TimeFrame } from "./types/cli";
import { Transaction, TransactionType } from "./types/ledger_file";

// first argument is ledger file
const file_name = process.argv[2];

// second argument is process type
const process_type: ProcessType = process.argv[3].toUpperCase() as ProcessType;

const transactions: Transaction[] = getLedgerFileAsJson(file_name);

switch (process_type) {
  case ProcessType.HISTORY:
    // thrird argument is max number of lines
    const max_lines = process.argv[4] ? parseInt(process.argv[4]) : 20;
    console.log(getObjectAsJsonString(getHistory(transactions, max_lines)));
    break;
  case ProcessType.SUMMARY:
    // third argument is TransactionType
    const transaction_type: TransactionType =
      process.argv[4].toUpperCase() as TransactionType;
    // fourth argument is TimeFrame
    const time_frame: TimeFrame = process.argv[5].toUpperCase() as TimeFrame;
    // fifth argument is year
    const year = process.argv[6]
      ? parseInt(process.argv[6])
      : new Date().getFullYear();
    // sixth argument is month
    const month = process.argv[7]
      ? parseInt(process.argv[7])
      : new Date().getMonth();

    console.log(
      getObjectAsJsonString(
        getSummary(transactions, transaction_type, time_frame, year, month)
      )
    );
    break;
  default:
    console.log("Invalid process type");
    break;
}
