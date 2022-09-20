## Description

This is the Frontend of our Application.
It enables the user to create Keys and Addresses for different Blockchains, send Transactions and so on.

Contains a react-native mobile application with basic ui

Since we rely on Multi Party Signatures, we don't just create Public-/Private-Keypairs, but we perform Signatures always together with a second party.
Each party holds a Key-_Share_, alone each _Share_ is useless, but both Shares together can perform the same actions as any ecdsa Key. (Signing, Derivation...)

Our [Api](https://github.com/lauhon/WalletPOC/tree/master/api) will act as that second party.

#### Packages

This acts as a Container for Packages that are still in Progress and will be used in the mobile project.
The reason is to save the trouble of bumping package versions with every change and forcing 'npm i'.

As soon as packages have reached a certain level of maturity they will be published to npm and moved into their own repository or into the global packages folder
