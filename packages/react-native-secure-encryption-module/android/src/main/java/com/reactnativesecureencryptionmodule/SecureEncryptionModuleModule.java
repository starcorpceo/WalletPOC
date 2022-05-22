package com.reactnativesecureencryptionmodule;

import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.io.IOException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.Signature;
import java.security.cert.CertificateException;

@ReactModule(name = SecureEncryptionModuleModule.NAME)
public class SecureEncryptionModuleModule extends ReactContextBaseJavaModule {
    public static final String NAME = "SecureEncryptionModule";

    public SecureEncryptionModuleModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }


    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    public void generateKeyPair(Promise promise) {

        promise.resolve("This should be the public key");
    }

    public static native int nativeMultiply(int a, int b);
}
