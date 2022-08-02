export interface VirtualAccount {
  /**
   * Account ID.
   */
  id: string;
  balance: AccountBalance;
  /**
   * Currency of account.
   */
  currency: string;
  /**
   * Indicates whether account is frozen or not.
   */
  frozen: boolean;
  /**
   * Indicates whether account is active or not.
   */
  active: boolean;
  /**
   * ID of newly created customer or existing customer associated with account.
   */
  customerId?: string;
  /**
   * For bookkeeping to distinct account purpose.
   */
  accountCode?: string;
  /**
   * All transaction will be accounted in this currency for all accounts.
   */
  accountingCurrency?: string;
  /**
   * Extended public key to generate addresses from.
   */
  xpub?: string;
}

export interface CustomerRegistration {
  /**
   * All transaction will be accounted in this currency for all accounts. Currency can be overridden per account level. If not set, EUR is used. ISO-4217
   */
  accountingCurrency?:
    | "AED"
    | "AFN"
    | "ALL"
    | "AMD"
    | "ANG"
    | "AOA"
    | "ARS"
    | "AUD"
    | "AWG"
    | "AZN"
    | "BAM"
    | "BBD"
    | "BDT"
    | "BGN"
    | "BHD"
    | "BIF"
    | "BMD"
    | "BND"
    | "BOB"
    | "BRL"
    | "BSD"
    | "BTN"
    | "BWP"
    | "BYN"
    | "BYR"
    | "BZD"
    | "CAD"
    | "CDF"
    | "CHF"
    | "CLF"
    | "CLP"
    | "CNY"
    | "COP"
    | "CRC"
    | "CUC"
    | "CUP"
    | "CVE"
    | "CZK"
    | "DJF"
    | "DKK"
    | "DOP"
    | "DOGE"
    | "DZD"
    | "EGP"
    | "ERN"
    | "ETB"
    | "EUR"
    | "FJD"
    | "FKP"
    | "FLOW"
    | "FUSD"
    | "GBP"
    | "GEL"
    | "GGP"
    | "GHS"
    | "GIP"
    | "GMD"
    | "GNF"
    | "GTQ"
    | "GYD"
    | "HKD"
    | "HNL"
    | "HRK"
    | "HTG"
    | "HUF"
    | "IDR"
    | "ILS"
    | "IMP"
    | "INR"
    | "IQD"
    | "IRR"
    | "ISK"
    | "JEP"
    | "JMD"
    | "JOD"
    | "JPY"
    | "KES"
    | "KGS"
    | "KHR"
    | "KMF"
    | "KPW"
    | "KRW"
    | "KWD"
    | "KYD"
    | "KZT"
    | "LAK"
    | "LBP"
    | "LKR"
    | "LRD"
    | "LSL"
    | "LTL"
    | "LVL"
    | "LYD"
    | "MAD"
    | "MDL"
    | "MGA"
    | "MKD"
    | "MMK"
    | "MNT"
    | "MOP"
    | "MRO"
    | "MUR"
    | "MVR"
    | "MWK"
    | "MXN"
    | "MYR"
    | "MZN"
    | "NAD"
    | "NGN"
    | "NIO"
    | "NOK"
    | "NPR"
    | "NZD"
    | "OMR"
    | "PAB"
    | "PEN"
    | "PGK"
    | "PHP"
    | "PKR"
    | "PLN"
    | "PYG"
    | "QAR"
    | "RON"
    | "RSD"
    | "RUB"
    | "RWF"
    | "SAR"
    | "SBD"
    | "SCR"
    | "SDG"
    | "SEK"
    | "SGD"
    | "SHP"
    | "SLL"
    | "SOS"
    | "SRD"
    | "STD"
    | "SVC"
    | "SYP"
    | "SZL"
    | "THB"
    | "TJS"
    | "TMT"
    | "TND"
    | "TOP"
    | "TRY"
    | "TTD"
    | "TWD"
    | "TZS"
    | "UAH"
    | "UGX"
    | "USD"
    | "UYU"
    | "UZS"
    | "VEF"
    | "VND"
    | "VUV"
    | "WST"
    | "XAF"
    | "XAG"
    | "XAU"
    | "XCD"
    | "XDR"
    | "XOF"
    | "XPF"
    | "YER"
    | "ZAR"
    | "ZMK"
    | "ZMW"
    | "ZWL";
  /**
   * Country customer has to be compliant with. ISO-3166-1
   */
  customerCountry?: string;
  /**
   * Customer external ID. Use only anonymized identification you have in your system. If customer with externalId does not exists new customer is created. If customer with specified externalId already exists it is updated.
   */
  externalId: string;
  /**
   * Country service provider has to be compliant with. ISO-3166-1
   */
  providerCountry?: string;
}

export interface CreateAccount {
  /**
   * Account currency. Supported values are BTC, BNB, LTC, DOGE, BCH, ETH, XLM, LUNA, LUNA_KRW, LUNA_USD, XRP, TRON, BSC, SOL, MATIC, ALGO, KCS, EGLD, CELO, KLAY, XDC, KCS, Tatum Virtual Currencies started with VC_ prefix (this includes FIAT currencies), USDT, WBTC, LEO, LINK, GMC, UNI, FREE, MKR, USDC, BAT, TUSD, BUSD, PAX, PAXG, MMY, XCON, USDT_TRON, BETH, BUSD, BBTC, BADA, WBNB, BDOT, BXRP, BLTC, BBCH, CAKE, BUSD_BSC, ERC20, BEP20 or TRC-10/20 custom tokens registered in the Tatum Platform, XLM or XRP Assets created via Tatum Platform. ERC20 tokens and BEP20 tokens do not have Testnet blockchains, so it is impossible to use them in a non-production environment.
   * You can emulate behaviour by <a href="#operation/createErc20">registering your custom ERC20 token</a> in the platform and receive tokens using <a href="https://erc20faucet.com/" target="_blank">https://erc20faucet.com/</a>.
   *
   */
  currency: string;
  /**
   * Extended public key to generate addresses from.
   */
  xpub?: string;
  customer?: CustomerRegistration;
  /**
   * Enable compliant checks. If this is enabled, it is impossible to create account if compliant check fails.
   */
  compliant?: boolean;
  /**
   * For bookkeeping to distinct account purpose.
   */
  accountCode?: string;
  /**
   * All transaction will be accounted in this currency for all accounts. Currency can be overridden per account level. If not set, customer accountingCurrency is used or EUR by default. ISO-4217
   */
  accountingCurrency?:
    | "AED"
    | "AFN"
    | "ALL"
    | "AMD"
    | "ANG"
    | "AOA"
    | "ARS"
    | "AUD"
    | "AWG"
    | "AZN"
    | "BAM"
    | "BBD"
    | "BDT"
    | "BGN"
    | "BHD"
    | "BIF"
    | "BMD"
    | "BND"
    | "BOB"
    | "BRL"
    | "BSD"
    | "BTN"
    | "BWP"
    | "BYN"
    | "BYR"
    | "BZD"
    | "CAD"
    | "CDF"
    | "CHF"
    | "CLF"
    | "CLP"
    | "CNY"
    | "COP"
    | "CRC"
    | "CUC"
    | "CUP"
    | "CVE"
    | "CZK"
    | "DJF"
    | "DKK"
    | "DOP"
    | "DOGE"
    | "DZD"
    | "EGP"
    | "ERN"
    | "ETB"
    | "EUR"
    | "FJD"
    | "FKP"
    | "FLOW"
    | "FUSD"
    | "GBP"
    | "GEL"
    | "GGP"
    | "GHS"
    | "GIP"
    | "GMD"
    | "GNF"
    | "GTQ"
    | "GYD"
    | "HKD"
    | "HNL"
    | "HRK"
    | "HTG"
    | "HUF"
    | "IDR"
    | "ILS"
    | "IMP"
    | "INR"
    | "IQD"
    | "IRR"
    | "ISK"
    | "JEP"
    | "JMD"
    | "JOD"
    | "JPY"
    | "KES"
    | "KGS"
    | "KHR"
    | "KMF"
    | "KPW"
    | "KRW"
    | "KWD"
    | "KYD"
    | "KZT"
    | "LAK"
    | "LBP"
    | "LKR"
    | "LRD"
    | "LSL"
    | "LTL"
    | "LVL"
    | "LYD"
    | "MAD"
    | "MDL"
    | "MGA"
    | "MKD"
    | "MMK"
    | "MNT"
    | "MOP"
    | "MRO"
    | "MUR"
    | "MVR"
    | "MWK"
    | "MXN"
    | "MYR"
    | "MZN"
    | "NAD"
    | "NGN"
    | "NIO"
    | "NOK"
    | "NPR"
    | "NZD"
    | "OMR"
    | "PAB"
    | "PEN"
    | "PGK"
    | "PHP"
    | "PKR"
    | "PLN"
    | "PYG"
    | "QAR"
    | "RON"
    | "RSD"
    | "RUB"
    | "RWF"
    | "SAR"
    | "SBD"
    | "SCR"
    | "SDG"
    | "SEK"
    | "SGD"
    | "SHP"
    | "SLL"
    | "SOS"
    | "SRD"
    | "STD"
    | "SVC"
    | "SYP"
    | "SZL"
    | "THB"
    | "TJS"
    | "TMT"
    | "TND"
    | "TOP"
    | "TRY"
    | "TTD"
    | "TWD"
    | "TZS"
    | "UAH"
    | "UGX"
    | "USD"
    | "UYU"
    | "UZS"
    | "VEF"
    | "VND"
    | "VUV"
    | "WST"
    | "XAF"
    | "XAG"
    | "XAU"
    | "XCD"
    | "XDR"
    | "XOF"
    | "XPF"
    | "YER"
    | "ZAR"
    | "ZMK"
    | "ZMW"
    | "ZWL";
  /**
   * Account number from external system.
   */
  accountNumber?: string;
}

export type VirtualAddress = {
  /**
   * Blockchain address.
   */
  address: string;
  /**
   * Currency of generated address. BTC, LTC, DOGE, BCH, ETH, XRP, XLM, BNB, TRX, ERC20, TRC20.
   */
  currency: string;
  /**
   * Derivation key index for given address.
   */
  derivationKey?: number;
  /**
   * Extended public key to derive address from. In case of XRP, this is account address, since address is defined as DestinationTag, which is address field. In case of XLM, this is account address, since address is defined as message, which is address field.
   */
  xpub?: string;
  /**
   * In case of XRP, destinationTag is the distinguisher of the account.
   */
  destinationTag?: number;
  /**
   * In case of BNB, message is the distinguisher of the account.
   */
  memo?: string;
  /**
   * In case of XLM, message is the distinguisher of the account.
   */
  message?: string;
};

export type VirtualBalance = {
  /**
   * Account balance represents all assets on the account, available and blocked.
   */
  accountBalance: string;

  /**
   * Available balance on the account represents account balance minus blocked amount on the account. Available balance should be user do determine how much can customer send or withdraw from the account.
   */
  availableBalance: string;
};

export type VirtualTransaction = {
  /**
   * Source account - source of transaction(s)
   */
  accountId: string;
  /**
   * Counter account - transaction(s) destination account. In case of blockchain recipient, this is addess of blockchain account.
   */
  counterAccountId?: string;
  /**
   * Transaction currency
   */
  currency: string;
  /**
   * Amount in account's currency
   */
  amount: string;
  /**
   * Whether the transaction is anonymous. If true, counter account owner does not see source account.
   */
  anonymous: boolean;
  /**
   * Time in UTC of transaction.
   */
  created: number;
  marketValue: VirtualMarketValue;
  /**
   * Type of operation.
   */
  operationType:
    | "PAYMENT"
    | "WITHDRAWAL"
    | "BLOCKCHAIN_TRANSACTION"
    | "EXCHANGE"
    | "FAILED"
    | "DEPOSIT"
    | "MINT"
    | "REVOKE";
  /**
   * Type of payment.
   */
  transactionType:
    | "FAILED"
    | "DEBIT_PAYMENT"
    | "CREDIT_PAYMENT"
    | "CREDIT_DEPOSIT"
    | "DEBIT_WITHDRAWAL"
    | "CANCEL_WITHDRAWAL"
    | "DEBIT_OUTGOING_PAYMENT"
    | "CREDIT_INCOMING_PAYMENT"
    | "EXCHANGE_BUY"
    | "EXCHANGE_SELL";
  /**
   * Transaction internal reference - unique identifier within Tatum ledger. In order of failure, use this value to search for problems.
   */
  reference: string;
  /**
   * For bookkeeping to distinct transaction purpose.
   */
  transactionCode?: string;
  /**
   * Note visible for sender.
   */
  senderNote?: string;
  /**
   * Note visible for both sender and recipient.
   */
  recipientNote?: string;
  /**
   * Payment ID defined in payment order by sender.
   */
  paymentId?: string;
  /**
   * Present only for operationType WITHDRAWAL and XLM / XRP based accounts it represents message or destinationTag of the recipient, if present.
   */
  attr?: string;
  /**
   * For operationType DEPOSIT it represents address, on which was deposit credited for the account.
   */
  address?: string;
  /**
   * For operationType DEPOSIT, BLOCKCHAIN_TRANSACTION it represents transaction id, for which deposit occured.
   */
  txId?: string;
};

/**
 * FIAT value of transaction.
 */
export type VirtualMarketValue = {
  /**
   * Value of transaction in given base pair.
   */
  amount: string;
  /**
   * Base pair.
   */
  currency:
    | "AED"
    | "AFN"
    | "ALL"
    | "AMD"
    | "ANG"
    | "AOA"
    | "ARS"
    | "AUD"
    | "AWG"
    | "AZN"
    | "BAM"
    | "BAT"
    | "BBD"
    | "BCH"
    | "BDT"
    | "BGN"
    | "BHD"
    | "BIF"
    | "BMD"
    | "BND"
    | "BOB"
    | "BRL"
    | "BSD"
    | "BTC"
    | "BTN"
    | "BWP"
    | "BYN"
    | "BYR"
    | "BZD"
    | "CAD"
    | "CDF"
    | "CHF"
    | "CLF"
    | "CLP"
    | "CNY"
    | "COP"
    | "CRC"
    | "CUC"
    | "CUP"
    | "CVE"
    | "CZK"
    | "DJF"
    | "DKK"
    | "DOP"
    | "DOGE"
    | "DZD"
    | "EGP"
    | "ERN"
    | "ETB"
    | "ETH"
    | "EUR"
    | "FJD"
    | "FKP"
    | "FLOW"
    | "FUSD"
    | "FREE"
    | "GMC"
    | "GMC_BSC"
    | "RMD"
    | "GBP"
    | "GEL"
    | "GGP"
    | "GHS"
    | "GIP"
    | "GMD"
    | "GNF"
    | "GTQ"
    | "GYD"
    | "HKD"
    | "HNL"
    | "HRK"
    | "HTG"
    | "HUF"
    | "IDR"
    | "ILS"
    | "IMP"
    | "INR"
    | "IQD"
    | "IRR"
    | "ISK"
    | "JEP"
    | "JMD"
    | "JOD"
    | "JPY"
    | "KES"
    | "KGS"
    | "KHR"
    | "KMF"
    | "KPW"
    | "KRW"
    | "KWD"
    | "KYD"
    | "KZT"
    | "LAK"
    | "LBP"
    | "LEO"
    | "LINK"
    | "LKR"
    | "LRD"
    | "LSL"
    | "LTC"
    | "LTL"
    | "LVL"
    | "LYD"
    | "MAD"
    | "MDL"
    | "MGA"
    | "MKD"
    | "MKR"
    | "MMK"
    | "MMY"
    | "MNT"
    | "MOP"
    | "MRO"
    | "MUR"
    | "MVR"
    | "MWK"
    | "MXN"
    | "MYR"
    | "MZN"
    | "NAD"
    | "NGN"
    | "NIO"
    | "NOK"
    | "NPR"
    | "NZD"
    | "OMR"
    | "PAB"
    | "PAX"
    | "PAXG"
    | "PEN"
    | "PGK"
    | "PHP"
    | "PKR"
    | "PLN"
    | "PYG"
    | "QAR"
    | "RON"
    | "RSD"
    | "RUB"
    | "RWF"
    | "SAR"
    | "SBD"
    | "SCR"
    | "SDG"
    | "SEK"
    | "SGD"
    | "SHP"
    | "SLL"
    | "SOS"
    | "SRD"
    | "STD"
    | "SVC"
    | "SYP"
    | "SZL"
    | "THB"
    | "TJS"
    | "TMT"
    | "TND"
    | "TOP"
    | "TRY"
    | "TTD"
    | "TRON"
    | "TUSD"
    | "BUSD"
    | "TWD"
    | "TZS"
    | "UAH"
    | "UGX"
    | "UNI"
    | "USD"
    | "USDC"
    | "USDT"
    | "USDT_TRON"
    | "USDT_MATIC"
    | "QTUM"
    | "UYU"
    | "UZS"
    | "VEF"
    | "VND"
    | "VUV"
    | "WBTC"
    | "WST"
    | "XAF"
    | "XAG"
    | "XAU"
    | "XCD"
    | "XCON"
    | "XDR"
    | "XOF"
    | "XPF"
    | "XRP"
    | "YER"
    | "ZAR"
    | "ZMK"
    | "ZMW"
    | "ZWL";
  /**
   * Date of validity of rate in UTC.
   */
  sourceDate: number;
  /**
   * Source of base pair.
   */
  source: string;
};
