#! /usr/bin/env node

import { faker } from "@faker-js/faker"
import chalk from "chalk";
import inquirer from "inquirer"

//Customer Class
class Customer {
    firstName: string
    lastName: string
    age: number
    gender: string
    mobNumber: number
    accNumber: number

    constructor(fName: string, lName: string, age: number, gender: string, mob: number, acc: number) {
        this.firstName = fName
        this.lastName = lName
        this.age = age
        this.gender = gender
        this.mobNumber = mob
        this.accNumber = acc
    }
}

//Interface Bank Account
interface BankAccount {
    accNumber: number,
    balance: number,
}

//Class Bank
class Bank {
    customer: Customer[] = [];
    account: BankAccount[] = [];

    addCustomer(obj: Customer) {
        this.customer.push(obj)
    }

    addAcoountNumber(obj: BankAccount) {
        this.account.push(obj);
    }

    transaction(accObj: BankAccount) {
        let NewAccounts = this.account.filter(acc => acc.accNumber !== accObj.accNumber);

        this.account = [...NewAccounts, accObj];
    }
}

let MCB = new Bank();

//Customer create
for (let i: number = 1; i <= 3; i++) {
    let fName = faker.person.firstName('male')
    let lName = faker.person.lastName()
    let num = parseInt(faker.phone.number("3#########"))
    const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
    MCB.addCustomer(cus);
    MCB.addAcoountNumber({ accNumber: cus.accNumber, balance: 100 * i })
}

//Bank Funtionaloty

async function bankService(bank: Bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Welcome to MCB Bank \n Please select the Service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit","Exit"]
        });
        // view Balance
        if (service.select == "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your Account Number:"
            });

            let account = MCB.account.find((acc) => acc.accNumber == res.num)
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number:"))
            }
            if (account) {
                let name = MCB.customer.find(
                    (item) => item.accNumber == account?.accNumber)
                console.log(`Dear ${chalk.green.italic(name?.firstName)}
            ${chalk.green.italic(name?.lastName)}
            your Account Balance is ${chalk.bold.blueBright(
                    `$${account.balance}`
                )}`);
            }
        };

        // Cash Withdraw
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your Account Number:"
            });
            let account = MCB.account.find((acc) => acc.accNumber == res.num)
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number:"))
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter your Amount.",
                    name: "Rupees"
                });

                if (ans.Rupees > account.balance) {
                    console.log(chalk.red.bold("Sorry you have insufficient balance, Kindly Recharge your account!"))
                }

                let newBalance = account.balance - ans.Rupees

                //Transaction method call
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
            };

            //Cash Deposit
            if (service.select == "Cash Deposit") {
                let res = await inquirer.prompt({
                    type: "input",
                    name: "num",
                    message: "Please Enter your Account Number:"
                });
                let account = MCB.account.find((acc) => acc.accNumber == res.num)
                if (!account) {
                    console.log(chalk.red.bold.italic("Invalid Account Number:"))
                }
                if (account) {
                    let ans = await inquirer.prompt({
                        type: "number",
                        message: "Please Enter your Amount.",
                        name: "Rupees"
                    });

                    let newBalance = account.balance + ans.Rupees

                    //Transaction method call
                    bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                }
            }
        }
        if (service.select =="Exit") {
            return;
        }
    }
    while (true)
}

bankService(MCB);