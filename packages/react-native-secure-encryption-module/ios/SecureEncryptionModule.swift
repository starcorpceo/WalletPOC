import Security
import Foundation

@available(iOS 10.0, *)
@objc(SecureEncryptionModule)
class SecureEncryptionModule: NSObject {
    
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
        
        print("Successfully created keypiar")
        resolve("Success")
    }
    
    
    @objc(decrypt:publicKeyName:resolver:rejecter:)
    func decrypt(_ encryptedText: NSString,publicKeyName key: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        print("decrypting message")
        
        let secKey = SecureEncryptionModule.loadKey(name: (key as String))!
        
        let algorithm: SecKeyAlgorithm = .eciesEncryptionCofactorVariableIVX963SHA256AESGCM
        guard SecKeyIsAlgorithmSupported(secKey, .decrypt, algorithm) else {
            resolve("error decrypting")
            return
        }
        var error: Unmanaged<CFError>?
        let encryptedStringVar = encryptedText as String;
        let clearTextData = SecKeyCreateDecryptedData(secKey,
                                                      algorithm,
                                                      encryptedStringVar.data(using: .utf8)! as CFData
                                                      ,
                                                      &error) as Data?
       
        
        let result = String(decoding: clearTextData!, as: UTF8.self)
        
        resolve(result)
    }
    
    @objc(encrypt:publicKeyName:resolver:rejecter:)
    func encrypt(_ clearText: NSString,publicKeyName key: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        print("Encrypting Message")
        
        guard let publicKey = SecKeyCopyPublicKey(SecureEncryptionModule.loadKey(name:key as String)!) else {
            resolve("Cant get Public Key")
            return
        }
        
        let algorithm: SecKeyAlgorithm = .eciesEncryptionCofactorVariableIVX963SHA256AESGCM
        
        guard SecKeyIsAlgorithmSupported(publicKey, .encrypt, algorithm) else {
            resolve("Algorithm not suppoerted")
            return
        }
        var encryptionError: Unmanaged<CFError>?
        var error: Unmanaged<CFError>?
        
        let clearTextData = (clearText as String).data(using: .utf8)!
        let cipherTextData = SecKeyCreateEncryptedData(publicKey, algorithm,
                                                       clearTextData as CFData,
                                                       &error) as Data?
        guard cipherTextData != nil else {
            resolve("cannot encrypt")
            return
        }

        resolve(cipherTextData!.base64EncodedString())
    }
}
