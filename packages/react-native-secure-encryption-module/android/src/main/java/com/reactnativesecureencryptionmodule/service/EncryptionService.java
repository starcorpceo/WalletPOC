package com.reactnativesecureencryptionmodule.service;

import android.content.Context;
import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyInfo;
import android.security.keystore.KeyProperties;
import android.util.Log;

import androidx.annotation.RequiresApi;

import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Signature;
import java.util.Base64;
import java.util.Optional;


public class EncryptionService {

  private static final String TAG = "EncryptionService";

  @RequiresApi(api = Build.VERSION_CODES.N)
  private static Optional<KeyStore.PrivateKeyEntry> loadPrivateKey(String alias) {
    try {
      KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
      keyStore.load(null);

      return Optional.of((KeyStore.PrivateKeyEntry) keyStore.getEntry(alias, null));
    } catch (Exception e) {
      Log.e(TAG, "Error while loading Key");
      e.printStackTrace();
      return Optional.empty();
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.M)
  public String generateKeyPair(String alias) {

    KeyPairGenerator kpg = null;
    try {
      kpg = KeyPairGenerator.getInstance(
        KeyProperties.KEY_ALGORITHM_EC, "AndroidKeyStore");


      kpg.initialize(new KeyGenParameterSpec.Builder(
        alias,
        KeyProperties.PURPOSE_SIGN | KeyProperties.PURPOSE_VERIFY)
        .setDigests(KeyProperties.DIGEST_SHA256,
          KeyProperties.DIGEST_SHA512)
        .build());

    } catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
      return "Algorithm not supported";

    } catch (NoSuchProviderException e) {
      e.printStackTrace();
      return "Provider not supported";
    } catch (InvalidAlgorithmParameterException e) {
      e.printStackTrace();
      return "AlgorithmParameter not supported";
    }


    KeyPair kp = kpg.generateKeyPair();
    return kp.getPublic().toString();
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  public String sign(String keyName, String message) {
    Optional<KeyStore.PrivateKeyEntry> key = loadPrivateKey(keyName);
    byte[] msg = message.getBytes(StandardCharsets.UTF_8);

    if (key.isPresent()) {
      try {
        KeyStore ks = KeyStore.getInstance("AndroidKeyStore");
        ks.load(null);
        KeyStore.Entry entry = ks.getEntry(keyName, null);
        if (!(entry instanceof KeyStore.PrivateKeyEntry)) {
          Log.w(TAG, "Not an instance of a PrivateKeyEntry");
          return null;
        }
        Signature s = Signature.getInstance("SHA256withECDSA");

        s.initSign(key.get().getPrivateKey());
        s.update(msg);
        byte[] signature = s.sign();

        return Base64.getEncoder().encodeToString(signature);

      } catch (Exception e) {
        e.printStackTrace();
        return "Error while signing";
      }
    }

    return "No Key with name exists in system";
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  public boolean verify(String keyName, String signature, String message) {
    Optional<KeyStore.PrivateKeyEntry> entry = loadPrivateKey(keyName);

    if (entry.isPresent()) {
      try {
        byte[] sig = Base64.getDecoder().decode(signature.getBytes(StandardCharsets.ISO_8859_1));
        byte[] msg = message.getBytes(StandardCharsets.UTF_8);
        Signature s = Signature.getInstance("SHA256withECDSA");
        s.initVerify(entry.get().getCertificate());
        s.update(msg);

        boolean valid = s.verify(sig);

        Log.i(TAG, "Actually Comparing");
        return valid;
      } catch (Exception e) {
        e.printStackTrace();
        return false;
      }
    }

    return false;
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  public boolean isKeySecuredOnHardware(String keyName){
    Optional<KeyStore.PrivateKeyEntry> entry = loadPrivateKey(keyName);

    if(entry.isPresent()) {
      try {
        KeyFactory factory = KeyFactory.getInstance(entry.get().getPrivateKey().getAlgorithm(), "AndroidKeyStore");
        KeyInfo keyInfo = factory.getKeySpec(entry.get().getPrivateKey(), KeyInfo.class);

        return keyInfo.isInsideSecureHardware();
      } catch (Exception e) {
        e.printStackTrace();
      }
    }

    return false;
  }

  public String encrypt(String keyName, String message) {

    return "Encryption not supported";
  }

  public String decrypt(String keyName, String cipherText) {

    return "Decryption not supported";
  }
}
