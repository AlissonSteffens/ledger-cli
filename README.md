# A simple ledger client

This is a simple ledger client that can be used to interact with the ledger files.
The main purpose of this client is to be able to talk to the ledger files from a web application, but it can also be used as a command line tool.
It talks to the ledger files, but parses the output and returns it in a more usable format (JSON).

## Command line usage

### History

```
npm start transactions.ledger history
```

### Balance

```
npm start transactions.ledger summary expense year 2023
```
