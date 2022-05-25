# react-native-secure-encryption-module

Uses Secure Enclave for iOS and KeyStore System for Android to encrypt data securely and keeping secrets safe on hardware level

## Installation

```sh
npm install react-native-secure-encryption-module
```

## Usage

### 1. Generate a KeyPair with an alias of your choice

Alias will be used throughout the process to access the key's and perform cryptographic actions with it.

```js
import { generateKeyPair } from 'react-native-secure-encryption-module';

// ...

const key = await generateKeyPair('my-key');
```

The method returns the alias back on success or error messages on failure.

### 2. Encrypt or sign

We want to use our keys to either [encrypt or sign](https://stackoverflow.com/questions/454048/what-is-the-difference-between-encrypting-and-signing-in-asymmetric-encryption) a string.
Both can be done easily like

```js
import { encrypt } from 'react-native-secure-encryption-module';

// ...

const cipher = await encrypt('Encrypt this message', 'my-key');
```

Return value is a base64 encoded cipher string

- or -

```js
import { sign } from 'react-native-secure-encryption-module';

// ...

const sign = await sign('Sign this message', 'my-key');
```

Return value is a base64 encoded signature

### 3. Decrypt or verify signature

After encrypting or signing the original string is not readable for a human and can be transported over non-trusted channels.
To decrypt the cipher or verify the signature we can call following methods

```js
import { decrypt } from 'react-native-secure-encryption-module';

// ...
// hash is the result of an earlier encryption
const cipher = '0xasdfasdfa....';
const clearText = await decrypt(cipher, 'my-key');
```

Return value should be the original method before encryption as string

- or -

```js
import { verify } from 'react-native-secure-encryption-module';

// ...
// signature is the result of the `sign` method
const signature = '0xasdfasdfa....';

const originalMessage = 'Sign this message';

const isOk = await verify(signature, originalMessage, 'my-key');
```

Return value is a boolean representing if the signature is really performed by our key

### Checking hardware support

Of course the hardware level security can only be achieved if the Device itself supports it. To read more about that

android - [Android keystore system](https://developer.android.com/training/articles/keystore)
ios: [Secure Enclave](https://developer.apple.com/documentation/security/certificate_key_and_trust_services/keys/storing_keys_in_the_secure_enclave)

We can check if our device supports what we need by calling

```js
import { isKeySecuredOnHardware } from 'react-native-secure-encryption-module';

// ...

const isSupported = await isKeySecuredOnHardware('my-key');
```

Return value is a boolean representing if hardware level security is available

## TODO's

Android: en- and decryption

## License

MIT
