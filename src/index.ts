import { getLedgerFileAsJson } from "./io/file_reader";
import getObjectAsJsonString from "./io/object_as_json_string";
import getHistory from "./services/history";
import { getSummary } from "./services/summary";
import { TimeFrame } from "./types/cli";
import { Transaction, TransactionType } from "./types/ledger_file";

import { Command } from "commander";
const program = new Command();

program.name("ledger-cli").description("A simple ledger cli");

// history command
program
  .command("history <file>")
  .option("-l, --limit <limit>", "Limit number of lines", "20")
  .description("Get history")
  .action((file, options) => {
    const max_lines = options.limit ? parseInt(options.limit) : 20;
    const transactions: Transaction[] = getLedgerFileAsJson(file);
    console.log(getObjectAsJsonString(getHistory(transactions, max_lines)));
  });

// summary command
program
  .command("summary <file> <transaction_type>")
  .option("-t, --time-frame <time_frame>", "Time frame", "MONTH")
  .option("-y, --year <year>", "Year", new Date().getFullYear().toString())
  .option("-m, --month <month>", "Month", new Date().getMonth().toString())
  .description("Get summary")
  .action((file, transaction_type, options) => {
    const time_frame: TimeFrame = options.timeFrame.toUpperCase() as TimeFrame;
    const year = options.year
      ? parseInt(options.year)
      : new Date().getFullYear();
    const month = options.month
      ? parseInt(options.month)
      : new Date().getMonth();
    const transactions: Transaction[] = getLedgerFileAsJson(file);
    console.log(
      getObjectAsJsonString(
        getSummary(
          transactions,
          transaction_type.toUpperCase() as TransactionType,
          time_frame,
          year,
          month
        )
      )
    );
  });

program.parse();
