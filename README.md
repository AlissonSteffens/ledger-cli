# A simple ledger client

This is a simple ledger client that can be used to interact with the ledger files.
The main purpose of this client is to be able to talk to the ledger files from a web application, but it can also be used as a command line tool.
It talks to the ledger files, but parses the output and returns it in a more usable format (JSON).

## Command line usage

Use `ts-node src/index.ts` to run the command line interface.
You can use `ts-node src/index.ts -h` to get a list of all the available commands.

### Examples

```
ts-node src/index.ts history transactions.ledger
ts-node src/index.ts summary transactions.ledger expense -t year -y 2023
```

## What is Ledger?

Ledger is a powerful, double-entry accounting system that is accessed from the UNIX command-line. This may put off some users, since there is no flashy UI, but for those who want unparalleled reporting access to their data there really is no alternative.

Ledger uses text files for input. It reads the files and generates reports; there is no other database or stored state.

Ledger is released under the BSD license.

## Why Ledger?

With the advancement of annotation tools and "second brains" like Obsidian, Notion, etc., I have been trying to organize myself with files in open formats, preferably PlainText, and migrating my resources that use proprietary formats.
The NoBoilerPlate explains in [this video](https://www.youtube.com/watch?v=WgV6M1LyfNY)(also available as text [here](https://github.com/0atman/noboilerplate/blob/main/scripts/34-Plain-Text-Team.md)), some reasons to avoid proprietary formats and use PlainText files.

Currently, all my financial control is done through an Excel sheet, which is excellent when I'm on Windows or MacOS, but impossible to work with on Linux. Additionally, it forces me to pay for a license every month for a package of which I use practically only one of the tools.

Although Ledger typically involves a program to generate reports from the data, the file format itself is humanly readable and easy to understand.

Each entry (transaction) is composed of 3 lines:

1.  The first line contains the date of the transaction and a description of it.
2.  The second line contains the Asset that received the amount and the amount received.
3.  The last line contains the Asset from which the money was withdrawn.

Example:

```
## Income
2023/10/16 Nevente
    Assets:Banking:Mybank   $1950.00
    Income:Nevente

## Expense
2023/10/01 Down the Street Hot Dog
    Expenses:Personal:Food:HotDog   $33.00
    Assets:Banking:Mybank
```

## What is Ledger-CLI?

Ledger-CLI is a command line interface for Ledger. It is written in NodeJS and is a new implementation of the Ledger command line interface.

### Why a new implementation?

I am a big fan of Ledger, but I want a GUI for it. I have tried several GUI's, but none of them really worked for me. I want a GUI that is easy to extend and that is easy to use.

WEB applications use some default formats for data exchange, and the most common format is JSON. The Ledger command line interface does not return JSON, only processed balances. I needed a way to convert the output of the Ledger command line interface to JSON.

The original Ledger command line interface is written in C++ and is not very easy to extend.

So, I decided to write a new implementation of the Ledger command line interface in NodeJS. This way I can extend the functionality of the Ledger command line interface and I can easily convert the output to JSON.

With this new implementation I can finally write a [GUI for Ledger](https://github.com/AlissonSteffens/ledger-gui).

> PS: This project is a work in progress, and is not ready for production.
> Also, I do not intend to implement all the features of the original Ledger command line interface. I will only implement the features that I need for the GUI.

## Implementation

I tried to keep the implementation as simple as possible. I used the [commander](https://www.npmjs.com/package/commander) package to parse the command line arguments.

Every command is implemented in a separate service file. The command line arguments are parsed and passed to the command implementation. The command implementation reads the file and executes the command. The output is parsed and returned in JSON format, logged to the console.

That way, I can call the command line interface from a web application with spawn and get the output in JSON format in the console. I than use this is string in the web application, as if it was a response from an API.
