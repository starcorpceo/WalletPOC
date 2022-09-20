<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
 <!-- <a href="Link to homegage or repo">
   <img src="images/logo.png" alt="Logo" width="80" height="80">
 </a> -->
 
 
 <h1 align="center">Multi Party Wallet - Proof of Concept</h1>
 
 <p align="center">
   A mobile banking app, without the bank.
    <br />

Open Source Crypto-Wallet with focus on Stable Coins, Ethereum Layer 2, efficient Ramp on/off and self custody. Fully banking compatible.
<br />
<a href="https://github.com/lauhon/WalletPOC/issues">Report Bug</a>
·
<a href="https://github.com/lauhon/WalletPOC/discussions">Request Feature</a>

 </p>
</div>
 
<!-- TABLE OF CONTENTS -->
<details>
 <summary>Table of Contents</summary>
 <ol>
  <li>
     <a href="#-description">Description</a>
   </li>
   <li>
     <a href="#-unique-features">Unique Features</a>
   </li>
   <li>
     <a href="#-goals-of-this-prototype">Goals of this Prototype</a>
   </li>
   <li>
     <a href="#%EF%B8%8F-goals-for-the-future">Goals for the Future</a>
   </li>
   <li><a href="#-building-blocks">Building Blocks</a>
       <ul>
           <li><a href="https://github.com/lauhon/WalletPOC/tree/master/mobile">Mobile App</a></li>
           <li><a href="https://github.com/lauhon/WalletPOC/tree/master/api">Api</a></li>
           <li><a href="https://github.com/lauhon/WalletPOC/tree/master/database">Database</a></li>
           <li><a href="https://github.com/lauhon/WalletPOC/tree/master/packages">Packages</a></li>
           <li><a href="https://github.com/lauhon/WalletPOC/tree/master/services">Services</a></li>
       </ul>
   </li>
   <li><a href="#-license">License</a></li>
   <li><a href="#-contact">Contact</a></li>
 </ol>
</details>
 
## 🐐 Description 
 
This repository acts as a Proof of Concept for the application that is the final product of this project.
The Goals of the whole project, which are explained down below, are ambitious. To make sure our goals are within reach of the team and to make sure
the existing ecosystem and technologies are matured enough, this Proof of Concept was built to implement each use-case in a minimal way.
 
<p align="right"><a href="#readme-top">🔝</a></p> 
## 🚀 Unique Features
 
### Free transactions
Send, receive or do whatever you want with your stablecoins, for free. (Additional tokens included)
 
### Fully banking compatible
Don’t be cut off. Use SEPA and Wiretransfer, without owning Fiat.
Debitcards are in the planning.
 
### No Know-How required
You don’t know anything about blockchains? That's not necessary. We abstract all the complicated stuff away.
 
<p align="right"><a href="#readme-top">🔝</a></p> 
## ✅ Goals of this Prototype
 
1. Fully non-custodial wallet
2. High Security by relying on Multi Party Computation (Based on [Unbounds C++ MPC Library](https://github.com/unboundsecurity/blockchain-crypto-mpc))
3. Use of known and established handling such as in mobile banking apps
4. No requirements of new know-how by users
5. Complete gasless (free) transfers of stablecoins (including various other tokens)
6. Full interoperability between the blockchain and traditional banking part - but without having to own FIAT (utilizing [Circle](https://www.circle.com/en/))
7. Absolute transparency through building in public (open source github repository)
 
<p align="right"><a href="#readme-top">🔝</a></p> 
## ⚒️ Goals for the Future
 
1. Audit Security
2. Streamline USDC/Polygon features via new UI
3. Fully Leverage Paymaster to enable free transactions
4. Fully interop between FIAT and Crypto by providing a Debit Card
 
<p align="right"><a href="#readme-top">🔝</a></p> 
## 🧱 Building Blocks
 
This Project is built as a Monorepo. The main parts of this Application each have a separate sub-directory. They could be moved to their own repository at any moment.
 
- [Mobile App](https://github.com/lauhon/WalletPOC/tree/master/mobile)
- [Api](https://github.com/lauhon/WalletPOC/tree/master/api)
- [Database](https://github.com/lauhon/WalletPOC/tree/master/database)
- [Packages](https://github.com/lauhon/WalletPOC/tree/master/packages)
- [Services](https://github.com/lauhon/WalletPOC/tree/master/services)
 
 
<p align="right"><a href="#readme-top">🔝</a></p> 
 
## 📄 License
 
This project is open source and it is granted to use it as reference to learn or build related products.
At this point there is no defined License in play, this still needs to be defined.
 
<p align="right"><a href="#readme-top">🔝</a></p> 
## 👋🏽 Contact
 
Please feel free to [open Issues](https://github.com/lauhon/WalletPOC/issues) if you want to point out bugs or problems or [start a discussion](https://github.com/lauhon/WalletPOC/discussions) to request features or just get in touch with us.
 
Any input or additions to our community are highly appreciated!
 
<p align="right"><a href="#readme-top">🔝</a></p>
