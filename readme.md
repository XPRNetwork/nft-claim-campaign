# NFT-claim

# Project Structure

This project is a monorepo, which means it is a GIT project that contains multiple projects. In the root folder, you will find:

- The `apps` folder which contains the source code of the dApp in the `web` folder
- The `contracts` folder which contains the source code of the smart contract in the `nft-claim` folder

# Technical Stack

This project uses:

- NodeJS
- Yarn
- Typescript
- Vercel
- NextJS
- @proton/cli
- @proton/web-sdk
- @proton/js
- atomicassets
- Tailwind
- Daisyui

# NextJS Application

The dApp is a NextJS application written in Typescript.

Next.js allows you to create full-featured web applications by extending the latest features of React and integrating powerful JavaScript tools based on Rust for faster versions.

Typescript is a supercharged version of JavaScript. If you don't know anything about code, don't worry, I've done everything to make it easy for you to deploy the app with minimal effort.

## Configuration of the dApp

In the root folder `app/web/src`, you will find a `project.json` file. This file allows you to configure:

- The title of your dApp for SEO
- The description of your dApp for SEO
- The color theme of your dApp
See the list of available themes at [https://daisyui.com/docs/themes/](https://daisyui.com/docs/themes/)
- Date formatting
- The different links that should appear in the menu and footer
- The different interface texts

## dApp Environment Variables

The environment variables in the `app/web/.env` file are information that will be compiled directly into the code when you deploy your application.

They are mainly used in this case to configure the connection with XPRNetwork and atomicassets.

<aside>
🚨 Do not include your private keys in the .env file! Since the dApp is a frontend application, the keys will be visible in the app's code directly from the browser!

</aside>

# Smart Contract

## Preparation

To set up your account and link it to the smart contract, you will need:

- NodeJS
- @proton/cli

### Install NodeJS

For the installation of Node JS, to have the up-to-date installation procedure that suits your platform, it is best to refer to the online documentation of NodeJS
[https://nodejs.org/en/download](https://nodejs.org/en/download)

Once your installation is complete, open your terminal and enter the following command:

```bash
$ node -v

```

After the command, the terminal should return a similar result

```bash
v21.1.0

```

**✅ NodeJS is now ready to use!**

### Install @proton/CLI

CLI stands for **Command Line Interface,** it is a set of scripts that allow you to interact with the blockchain from your terminal. It is a NodeJS package that is installed globally, meaning it is available in your terminal from any folder.

To install it, enter the following command

```bash
$ npm i @proton/cli -g
```

Once the installation process is complete, check that the package is installed correctly

```bash
$ proton version
```

After the command, the terminal should return a similar result

```bash
0.1.93
```

**✅ @proton/cli is now ready to use!**

## Create the Account

<aside>
🚨 One account = one smart contract, I recommend creating a new account to deploy the smart contract.

</aside>

First, set the network you want to operate on

**For the mainnet:**

```bash
$ proton chain:set proton
```

**For the testnet:**

```bash
$ proton chain:set proton-test
```

After the command, the terminal should return a similar result

```bash
# For the mainnet
Success: Switched to chain proton
# For the testnet
Success: Switched to chain proton-test
```

For project management, I always use the same procedure to make sure to save the private information of my new account as soon as it is created.

1. **Create a new key pair and save it to a file**
2. **Check if the account is available on the blockchain**
3. **Create the account on the blockchain**
4. **Add the private key to the secure storage of the CLI**

### 1. **Create a new key pair and save it to a file**

First, navigate to the `contracts` folder in your terminal

```bash
$ cd absolute/path/to/project/**contracts/ntfclaim**
```

Enter the following command to generate a new key pair

```bash
# If you are on the mainnet
$ proton key:generate > mainnet.txt
# If you are on the testnet
$ proton key:generate > testnet.tx
```

Note that the use of `> mainnet.txt` does not return any result, it tells the terminal that the command output should be printed to a file named `mainnet.txt` (or `testnet.txt`)

Check that the file has been created successfully, it should look like this:

![Capture_decran_2023-12-21_a_08 12 07](https://github.com/XPRNetwork/nft-claim-campaign/assets/1812457/c0da9ee9-8e9e-42ac-b9ce-c4d8080f521a)


### 2. **Check if the account is available on the blockchain**

Before proceeding with this step, make sure that the account name you want to create does not already exist on the network you want to operate on. Enter the following command (replace **`youraccname`** with the account name you want to check)

```bash
$ proton account **youraccname**
```

If the account does not exist, your terminal will display an error similar to the following, which means that this name is available on the network you want to operate on.

```bash
(Use `node --trace-deprecation ...` to show where the warning was created)Error: unknown key (boost::tuples::tuple<bool, eosio::chain::name, boost::tuples::null_type, boost::tuples::null_type, boost::tuples::null_type, boost::tuples::null_type,boost::tuples::null_type, boost::tuples::null_type, boost::tuples::null_type, boost::tuples::null_type>): (0 quipuducu)

```

If the account exists, the terminal will return the following result:

```bash
Created:
Dec-08-2023, 12:35:05 AM

Permissions:
owner (=1):
 +1 PUB_K1_6xcoy2RFv4zrCJm7qaE3tHP2kPgQiFLZhv8g9i1mJY6fpf6iCa

    active (=1):
     +1 PUB_K1_6xcoy2RFv4zrCJm7qaE3tHP2kPgQiFLZhv8g9i1mJY6fpf6iCa
     +1 12daysb4xmas@eosio.code

Resources:
 Type Used      Available Max       Delegated
 ──── ───────── ───────── ───────── ───────────
 RAM  278.04 KB 174.5 KB  452.54 KB
 CPU  862 µs    861.87 ms 863.11 ms 10.0000 SYS
 NET  112 Bytes 4.32 MB   4.32 MB   10.0000 SYS
```

This means that you need to choose another account name for the network you want to operate on.

<aside>
💡 I often use this command to monitor the available resources on my accounts.

</aside>

### 3. **Create the account on the blockchain**

To create the account on the blockchain, enter the following line in your terminal (replace **`youraccname`** with the account name you want to create)

```bash
$ proton account:create **youraccname**
```

The account creation process starts and asks you for the private key that should be linked to this account:

```bash
Enter private key for new account (leave empty to generate new key):
```

Copy and paste the private key (starting with `PVT_K1_`) from the file that was generated in [step 1](https://www.notion.so/NFT-claim-37c97f5a2f1842e3b0c99f335ed6fd5d?pvs=21)

The process continues and the terminal asks you to enter your email address

```bash
Enter email for verification code:
```

<aside>
💡 If the network you want to operate on is **testnet**, you can enter a fake email, as long as it ends with [gmail.com](http://gmail.com/) (e.g., [gv65hg@gmail.com](mailto:gv65hg@gmail.com))

</aside>

The process continues and the terminal asks you to provide the **display name** of the account. The **display name** does not need to comply with account name rules (a-z, 1-5), so you can be creative within reasonable limits 🙂

```bash
Enter display name for account:
```

The last step of the process is the code you received by email at the address you provided earlier.

```bash
Enter 6-digit verification code (sent to gv65hg@gmail.com):
```

<aside>
💡 If the network you want to operate on is **testnet**, the code is always **000000**

</aside>

The terminal should return the following result:

```bash
Account **youraccname** successfully created!
```

**✅ Your account is now created!**

### 4. **Add the private key to the secure storage of the CLI**

To allow @proton/cli to interact with the blockchain, it needs to be provided with the private key for the network you want to operate on.

Enter the following command

```bash
$ proton key:add
```

The terminal will ask you to provide the private key following it. To do this, copy and paste the private key (starting with `PVT_K1_`) from the file generated in [step 1](https://www.notion.so/NFT-claim-37c97f5a2f1842e3b0c99f335ed6fd5d?pvs=21).

```bash
Enter private key (starts with PVT_K1):
```

Once this is done, and if it is the first time you are using @proton/cli, you will be asked if you want to protect access to the private keys with a unique 32-character password. This is optional, but it is recommended

<aside>
🚨 Keep the password you enter safe, as there is no way to recover it, and you will be asked for it **every time you make a transaction with the blockchain**

</aside>

```bash
Please enter your 32 character password:
```

After completing this step, the terminal returns

```bash
Success: Added new private key for public key: PUB_K1_5v5Sk3iSrpjPs77KF9UThQfpHRe6g77EqhYfoDcXpSGhaVYhiz
```

**✅ Your private key has been successfully added!**

## Provision the Resources for your Account

To be able to deploy the contract on the newly created account, you need to provision this account with RAM. To do this, you will need to:

1. **Hold XPR tokens in this account or claim XPR faucets if it is a testnet account**
2. **Buy RAM**

### 1a. **Hold XPR tokens in this account**

To do this, transfer XPR tokens from another account you own (this also works for the testnet), or use the Fiat-ramp to buy XPR tokens (mainnet only).

**✅ Skip directly to step 2**

### 1b. **Claim XPR faucets (testnet only)**

To do this, follow the following process (replace **`youraccname`** with the account name you created)

```bash
$ proton faucet:claim XPR **youraccname**
```

If you have protected key access with a password:

```bash
Please enter your 32 character password:
```

Finally, the terminal returns:

```bash
Success: Faucet claimed
```

**✅ You now have 1000 XPR tokens!**

### 2. **Buy RAM**

To acquire RAM, enter the following commands (replace **`youraccname`** with the RAM buyer's account name and the RAM beneficiary's account name, and **450000** with the number of bytes to be purchased (+/- 900 XPR, 1 byte = 0.002 XPR))

```bash
$ proton ram:buy **youraccname youraccname 450000**
```

If you have protected key access with a password:

```bash
Please enter your 32 character password:
```

Finally, the terminal returns:

```bash
Success: RAM Purchased
```

**✅ Your account is now ready to receive the smart contract!**

## Deploy the Smart Contract

Here you need to be attentive, as several commands follow one another. If one of them is incorrect, you will need to restart this process:

First, make sure you are in the contract's folder

```bash
$ cd absolute/path/to/project/**contracts/ntfclaim**
```

<aside>
👌 At this point, you can copy/paste the commands into your terminal

</aside>

Next, we will compile the contract:

```bash
$ npm run build
```

This should return a similar result

```bash
Build Starting ·····
```

```bash
Build progressing. Generating target files ······
Build Done. Targets generated. Target directory: target.
```

Now we will copy the compiled files to a new folder

```makefile
$ rm -rf ./deploy && mkdir deploy && cd ./target && cp ./nftclaim.contract.wasm ./../deploy/nftclaim.contract.wasm && cp ./nftclaim.contract.abi ./../deploy/nftclaim.contract.abi
```

And now for the final step of our journey, we deploy the contract to the dedicated account!

```bash
$ cd ./deploy/ && proton contract:set **youraccname** ./
```

Your terminal should respond with something like this:

```bash
No issue with the existing contract found. Continuing.
```

If you have protected key access with a password:

```bash
Please enter your 32 character password:
```

And finally

```bash
get abi for eosio
get abi for eosio
WASM Successfully Deployed:
<https://testnet.explorer.xprnetwork.org/tx/7abf3e17a96965e3fadeb0ee1cf0328c01021bef39cc598d3448ff31084586b0?tab=traces>
get abi for eosio
get abi for eosio
ABI Successfully Deployed:
<https://testnet.explorer.xprnetwork.org/tx/c310cdc6238f850fbae77763a0c5958906a6d2803639585cb1f12665edeb152d?tab=traces>
```

If you deploy the contract a second time, you may encounter an error

```bash
Error: Inline actions already enabled
```

Don't worry about it, it's just @proton/cli applying a rule arbitrarily: on contracts, `inline actions` are only enabled on the first contract deployment, hence the error message.

**✅ Your Smart contract is deployed!**

Now verify if on your account on XPRNetwork explorer

**Mainnet**: https://explorer.xprnetwork.org/account/**youraccname
Testnet**: https://testnet.explorer.xprnetwork.org/account/**youraccname**

You should see: 
![Capture_decran_2023-12-21_a_11 21 41](https://github.com/XPRNetwork/nft-claim-campaign/assets/1812457/3cc57787-9d69-4f30-8b25-adc99efbf8fa)
![Capture_decran_2023-12-21_a_11 22 07](https://github.com/XPRNetwork/nft-claim-campaign/assets/1812457/4a333702-5764-4b16-a1c5-c1c047ec37f4)



# 😎 Congratulation the job is done
