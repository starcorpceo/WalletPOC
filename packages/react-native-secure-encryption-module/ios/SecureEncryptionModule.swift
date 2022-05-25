import Security
import Foundation

@objc(SecureEncryptionModule)
class SecureEncryptionModule: NSObject {
    
    @objc(decrypt:keyName:resolver:rejecter:)
    func decrypt(_ encryptedText: NSString,keyName key: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        print("decrypting message")
        
        let secKey = SecureEncryptionModule.loadKey(name: (key as String))!
        
        resolve(Encryption.decrypt(encryptedText: encryptedText as String, privateKey: secKey))
    }
    
    @objc(encrypt:keyName:resolver:rejecter:)
    func encrypt(_ clearText: NSString,keyName key: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        print("Encrypting Message")
        
        let secKey = SecureEncryptionModule.loadKey(name:key as String)!
        
        guard let publicKey = SecKeyCopyPublicKey(secKey) else {
            resolve("Cant get Public Key")
            return
        }
        
        resolve(Encryption.encrypt(clearText: clearText as String, publicKey: publicKey))
    }
    
    @objc(signMessage:keyName:resolver:rejecter:)
    func signMessage(_ message: NSString, keyName key: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        print("Signing Message")
        
        let secKey = SecureEncryptionModule.loadKey(name:key as String)!
        
        resolve(Signature.sign(message: message as String, privateKey: secKey))
    }
    
    @objc(verifySignature:signedString:keyName:resolver:rejecter:)
    func verifySignature(_ signature: NSString, signedString message: NSString, keyName key: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        print("Signing Message")
        
        let secKey = SecureEncryptionModule.loadKey(name:key as String)
        
        guard secKey != nil else {
            resolve("No such key exists")
            return
        }
        
        guard let publicKey = SecKeyCopyPublicKey(secKey!) else {
            resolve("Cant get Public Key")
            return
        }
        
        resolve(Signature.verify(signature: signature as String, signedString: message as String, publicKey: publicKey))
    }
    
    @objc(isKeySecuredOnHardware:resolver:rejecter:)
    func isKeySecuredOnHardware(_ keyName: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        
        let secKey = SecureEncryptionModule.loadKey(name:keyName as String)
        
        guard secKey != nil else {
            resolve("No such key exists")
            return
        }
        
        // Resolving to true here, iOs does not provide a simple api for checking hardware security. But as long as the device is not jailbreaked
        // We are safe to assume that the key is only available for the Secure Enclave because we passed the corresponindg parameters in "generateKeyPair"
        resolve(true)
    }
    
    @objc(generateKeyPair:resolver:rejecter:)
    func generateKeyPair(_ alias: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        print("Generating Key Pair")
        // let flags: SecAccessControlCreateFlags
        
        // if #available(iOS 11.3, *) {
        //    flags = [.privateKeyUsage, .biometryCurrentSet]
        // } else {
        //    flags = [.privateKeyUsage, .touchIDCurrentSet]
        // }
        
        // let access = SecAccessControlCreateWithFlags(kCFAllocatorDefault, // kSecAttrAccessibleWhenUnlockedThisDeviceOnly, flags, nil)!
        
        let access =
        SecAccessControlCreateWithFlags(kCFAllocatorDefault,kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
                                        [.privateKeyUsage],
                                        nil)!
        
        let tag = (alias as String).data(using: .utf8)!
        let attributes: [String: Any] = [
            kSecAttrKeyType as String : kSecAttrKeyTypeEC,
            kSecAttrKeySizeInBits as String : 256,
            kSecAttrTokenID as String : kSecAttrTokenIDSecureEnclave,
            kSecPrivateKeyAttrs as String : [
                kSecAttrIsPermanent as String       : true,
                kSecAttrApplicationTag as String    : tag,
                kSecAttrAccessControl as String     : access
            ]
        ]
        
        var error: Unmanaged<CFError>?
        guard let privateKey = SecKeyCreateRandomKey(attributes as CFDictionary, &error) else {
            let err = error!.takeRetainedValue() as Error
            resolve("Error while creating KeyPair")
            print(err)
            return
        }
        
        guard let publicKey = SecKeyCopyPublicKey(privateKey) else {
            resolve("Cant get key")
            print("Could not find public key")
            return
        }
        
        guard let cfdata = SecKeyCopyExternalRepresentation(publicKey, &error) else {
            resolve("Could not export key")
            print(error!)
            return
        }
                
       let data:Data = cfdata as Data
       let b64Key = data.base64EncodedString()
        
        print("Successfully created keypiar")
        resolve(b64Key)
    }
    
    static func loadKey(name: String) -> SecKey? {
        let tag = name.data(using: .utf8)!
        
        let query: [String: Any] = [
            kSecClass as String                 : kSecClassKey,
            kSecAttrApplicationTag as String    : tag,
            kSecAttrKeyType as String           : kSecAttrKeyTypeEC,
            kSecReturnRef as String             : true
        ]
        
        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        guard status == errSecSuccess else {
            print("Error: No key found")
            return nil
        }
                
        return (item as! SecKey)
    }
}
