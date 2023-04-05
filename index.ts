#!/src/bin/env node

// This somewhat complex TypeScript/Node.js project is a console-based application. 
// When the system starts the user is prompted with a user id and user pin. 
// After entering the details successfully, the ATM functionalities are unlocked. 
// All the user data is generated randomly.

import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
// =================================================================================
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
async function welcome(){
    let rainbow = chalkAnimation.rainbow("Welcome to the ATM");
    await sleep(1000);
    rainbow.stop();
}
// =================================================================================
let user_id: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let user_pin: number[] = [1234, 2345, 3456, 4567, 5678, 6789, 7890, 8901, 9012, 1230];
let withdrawlAmount: number[] = [1000,2000,3000,4000,5000,10000, 20000, 25000];
let user_balance: number = 100000;
let user_withdraw_transaction: number[] = [];
let user_deposit_transaction: number[] = [];
// =================================================================================

// verify user function
async function verifyUser() {
    // console.clear();
    await welcome();
    var answer = await  inquirer.prompt([
        {
            type:"number",
            name:"user_ID",
            message:"Enter User ID: "
        },
        {
            type:"number",
            name:"user_PIN",
            message:"Enter 4 digit PIN: "
        }
    ]);
    let result = user_id.includes(answer.user_ID) && user_pin.includes(answer.user_PIN);
    if (result) {
        console.log(chalk.blue("User Verified!!!"));
        console.log(chalk.green("============================="));
        console.log(chalk.green("Please select an option"));
        console.log(chalk.green("1. Withdraw"));
        console.log(chalk.green("2. Deposit"));
        console.log(chalk.green("3. Check Balance"));
        console.log(chalk.green("4. Transaction History"));
        console.log(chalk.green("5. Exit"));
        console.log(chalk.green("============================="));
        var options = await inquirer.prompt([{
            type:"number",
            name:"user_option",
            message:"Enter your option: "
        }]);
        switch(options.user_option){
            // =================================================================================
            // case 1: withdraw amount
            case 1:
                console.log(chalk.green("Withdraw"));
                var withdraw = await inquirer.prompt([{
                    type:"list",
                    name:"user_option",
                    message:"Enter Amount: ",
                    choices: withdrawlAmount,
                }]);
                if(withdraw.user_option > user_balance){
                    console.log(chalk.red("Insufficient Balance"));
                    // break;
                }else if(withdraw.user_option > 25000){
                    console.log(chalk.red("Maximum withdrawl amount is 25000"));
                    // break;
                }else if(withdraw.user_option < 1000){
                    console.log(chalk.red("Minimum withdrawl amount is 1000"));
                    // break;
                }else if(withdraw.user_option <= 25000){
                    console.log(chalk.green("Please wait..."));
                    await sleep(1000);
                    console.log(chalk.green("Please collect your cash of " + withdraw.user_option + " PKR"));
                    console.log("+-------------------------------------+");
                    console.log(chalk.blue("\tWithdrawl Record"));
                    await sleep(500);
                    let userID = answer.user_ID;
                    let withDrawAmount = withdraw.user_option;
                    let remainingBalance = user_balance - withDrawAmount;
                    user_withdraw_transaction.push(userID);
                    user_withdraw_transaction.push(withDrawAmount);
                    user_withdraw_transaction.push(remainingBalance);
                    console.log("+-------------------------------------+");
                    console.log(chalk.green(`Time: ${new Date().toLocaleString()}\nUser ID: ${userID}`));
                    console.log(chalk.green(`Withdrawn Amount: ${withDrawAmount} PKR`));
                    console.log(chalk.green(`Remaining Balance: ${remainingBalance} PKR`));
                    console.log("+-------------------------------------+");
                }
                // clear the content of an array
                user_withdraw_transaction = [];
            // =================================================================================
                break;
            // =================================================================================
            case 2:
                console.log(chalk.green("Deposit"));
                var deposit = await inquirer.prompt([{
                    type:"number",
                    name:"user_deposit",
                    message:"Enter Deposit Amount: "
                }]);
                if(deposit.user_deposit < 1000){
                    console.log(chalk.red("Minimum deposit amount is 1000"));
                    break;
                }else if(deposit.user_deposit >= 1000){
                    console.log(chalk.green("Deposit was successful!!!"));
                    let depositedAmount = deposit.user_deposit;

                    let newBalance = user_balance + depositedAmount;
                    console.log("+-------------------------------------+");
                    console.log(chalk.blue("\tDeposit Record"));
                    await sleep(500);
                    user_deposit_transaction.push(answer.user_ID);
                    user_deposit_transaction.push(deposit.user_deposit);
                    user_deposit_transaction.push(newBalance);
                    console.log("+-------------------------------------+");
                    console.log(chalk.green(`Time: ${new Date().toLocaleString()}\nUser ID:  ${user_deposit_transaction[0]}`));
                    console.log(chalk.green(`Deposited Amount:  ${user_deposit_transaction[1]} PKR`));
                    console.log(chalk.green(`New Balance: ${user_withdraw_transaction[1] + user_deposit_transaction[1]} PKR`));
                    console.log("+-------------------------------------+");
                }else{
                    console.log(chalk.red("Invalid amount"));
                }
                // clear the content of an array
                // user_deposit_transaction = [];
                break;
            // =================================================================================
            case 3:
                console.log(chalk.green("Check Balance"));
                // check balance function
                function checkBalance(deposit: number, withdraw: number){
                    if(deposit == 0 && withdraw == 0){
                        console.log(chalk.red(`Your current balance is: ${user_balance}`));
                    }else if(deposit > 0 && withdraw == 0){
                        console.log(chalk.red(`Your current balance is: ${user_balance + user_deposit_transaction[1]}`));
                    }else if(deposit == 0 && withdraw > 0){
                        console.log(chalk.red(`Your current balance is: ${user_balance - user_withdraw_transaction[1]}`));
                    }else if(deposit > 0 && withdraw > 0){
                        console.log(chalk.red(`Your current balance is: ${user_balance + user_deposit_transaction[1] - user_withdraw_transaction[1]}`));
                    }
                }
                checkBalance(user_deposit_transaction[1], user_withdraw_transaction[1]);
                // console.log(chalk.red(`Your current balance is: ${user_balance + user_deposit_transaction[1] - user_withdraw_transaction[2]}`));
                break;
            // =================================================================================
            case 4:
                // transaction history still in progress
                console.log("+--------------------------------------------------------------------+");
                console.log(chalk.blue("\t\t\tTransaction History"));
                console.log("+--------------------------------------------------------------------+");
                console.log(chalk.green(`User ID: ${user_withdraw_transaction[0]} Amount: ${user_withdraw_transaction[1]}PKR ${new Date().toLocaleString()}`));
                console.log(chalk.green(`User ID: ${user_deposit_transaction[0]} Amount: ${user_deposit_transaction[1]}PKR ${new Date().toLocaleString()}`));
                console.log("+--------------------------------------------------------------------+");
                break;
            // =================================================================================
            // case 5: transaction history
            case 5:
                if(await inquirer.prompt([{type:"confirm", name:"restart", message:"Do you want to make another transaction?"}]) == true){
                    await startAgain();
                }else{
                    console.log(chalk.green("Thank you for using our ATM"));
                }
                break;
            default:
                console.log(chalk.red("Invalid option"));
        }

    }else{
        console.log(chalk.red("User not found"));
    }
    return result;
}
// start the program again
async function startAgain(){
    do{
        console.clear();
        await verifyUser();
        var answer = await inquirer.prompt([
            {
                type:"confirm",
                name:"startAgain",
                message:"Do you want make another transaction."
            }
        ]);
    }while(answer.startAgain == true);
}
startAgain();