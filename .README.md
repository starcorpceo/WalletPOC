# Multi Party Wallet Proof of Concept

## Description

This project contains a POC for a mobile Wallet application.
It has 3 main goals:

1. High Security by relying on Multi Party Computation (Based on [Unbounds C++ MPC Library](https://github.com/unboundsecurity/blockchain-crypto-mpc))
2. Making Cryptocurrencies practical by focussing on Real World Applications of Currencies (payments). During the making of this Project, we will try to find means to keep transaction costs as low as possible and ideally lower than VISA/MasterCard Fees
3. Bringing some useful features from the traditional Banking world into Crypto - Transaction Size/Rate Limits, UX Features like AddressBook, Increased Security by MPC and Key Rotation
4. NOT to Bullshit users By designing a Wallet that keeps Fees as low as possible by any means while still keeping this Business alive. By being transparent in what exactly we do. By educating users about what this Project is about.

## Building Blocks

This Project is built as a Monorepo. The main parts of this Application each have a separate sub-directory. They could be moved to their own repository at any moment.

### Mobile

This is the Frontend of our Application.
It enables the user create Keys and Addresses for different Blockchains, send Transactions and so on.

Contains a react-native mobile application with basic ui

Since we rely on Multi Party Signatures, we dont just create Public-/Private-Keypairs, but we perform Signatures always together with a second party.
Each party holds a Key-_Share_, alone each _Share_ is useless, but both Shares together can perform the same actions as any ecdsa Key. (Signing, Derivation...)

Our Api will act as that second party.

#### Packages

This acts as a Container for Packages that are still in Progress and will be used in the mobile project.
The reason is to save the trouble of bumping package versions with every change and forcing 'npm i'.

As soon as packages have reached a certain level of maturity they will be published to npm and moved into their own repository or into the global packages folder

### Api

Acts as second party for Cryptographic Multi Parti Actions like key generation, derivation and signature creation.

Is Powered by [Fastify](https://www.fastify.io/) and [Prisma as ORM](https://www.prisma.io/)

To be able to save Keyshares for our Users we need a Database

### Database

Acts as Server Side Storage for our second party.

Contains a simple docker-compose to start up a database during development

### Packages

Contains npm packages which represent major building blocks of the application.
Since each of those Building Blocks are independent from the rest of the application, we could provide them as generalized npm packages

#### React Native Blockchain Crypto MPC

https://www.npmjs.com/package/react-native-blockchain-crypto-mpc

Acts as a typescript facade for [Unbounds C++ MPC Library](https://github.com/unboundsecurity/blockchain-crypto-mpc) to be used in react-native applications

#### React Native Secure Encryption Module

https://www.npmjs.com/package/react-native-secure-encryption-module

Can be used to create and store ECDSA Keys on ios and android in the most secure manner.
On each platform all Devices (which are modern and relevant enough) have dedicated hardware to securely store private keys.
Those Private Keys are designed on a hardware level to not be extractable.

#### React Native Backup Storage Module

TO BE DONE

Will act as backup for the client side Key Shares
