Setup

% git clone git@github.com:rrazony/paypal.git
% cd paypal
% npm i

Start grunt to start the Express server.  Any changes to api.js will
cause grunt to restart the Express server.
% grunt dev

To run the client program:
% ./paypal < input.txt
OR
$ ./paypal input.txt

Assumptions:
- Used in-memory storage instead of other kinds of storage (fs, MongoDB, etc.) to 
  simplify development.
- Used Express JS because it is simple to get a REST api up with it
- Used PATCH http method because it is used for updating an existing resource
- Used NodeJS Readline module because it is well-suited for line-by-line processing
  of the input.txt file
- Used Grunt because it is easy to configure for restarting express server automatically
  when changes are made to the REST api source code

# Basic Credit Card Processing
-----

Imagine that you're writing software for a credit card provider.  Implement a
program that will add new credit card accounts, process charges and credits
against them, and display summary information.

## Requirements:

- Your program must accept input from two sources: a filename passed in
  command line arguments and STDIN. For example, on Linux or OSX both
  './myprogram input.txt' and './myprogram < input.txt' should work.
- Your program must accept three input commands passed with space delimited
  arguments.
- "Add" will create a new credit card for a given name, card number, and limit
   - Card numbers should be validated using Luhn 10
   - New cards start with a $0 balance
- "Charge" will increase the balance of the card associated with the provided
  name by the amount specified
   - Charges that would raise the balance over the limit are ignored as if they
     were declined
   - Charges against Luhn 10 invalid cards are ignored
- "Credit" will decrease the balance of the card associated with the provided
  name by the amount specified
   - Credits that would drop the balance below $0 will create a negative balance
   - Credits against Luhn 10 invalid cards are ignored
- Expose â€œAddâ€, â€œChargeâ€ and â€œCreditâ€ methods as REST APIs. Use any framework to do so.
- When all input has been read and processed, a summary should be generated and
  written to STDOUT.
- The summary should include the name of each person followed by a colon and
  balance
- The names should be displayed alphabetically
- Display "error" instead of the balance if the credit card number does not pass
  Luhn 10

## Input Assumptions:

- All input will be valid -- there's no need to check for illegal characters
  or malformed commands.
- All input will be space delimited
- Credit card numbers may vary in length up to 19 characters
- Credit card numbers will always be numeric
- Amounts will always be prefixed with "$" and will be in whole dollars (no
  decimals)

## Example Input:

```
Add Tom 4111111111111111 $1000
Add Lisa 5454545454545454 $3000
Add Quincy 1234567890123456 $2000
Charge Tom $500
Charge Tom $800
Charge Lisa $7
Credit Lisa $100
Credit Quincy $200
```

## Example Output:

```
Lisa: $-93
Quincy: error
Tom: $500
```

Implement your solution in any programming language you wish, but keep in mind
we may ask you to explain or extend your code.  Please write automated tests
and include them with your submission.

In addition to your code and tests, please also include a README that explains:

- An overview of your design decisions
- Why you picked the programming language you used
- How to run your code and tests, including how to install any dependencies
  your code may have.
- Any assumptions that you made.
