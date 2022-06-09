package com.reactnativeblockchaincryptompc;

import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativeblockchaincryptompc.cryptompc.CPPBridge;
import com.reactnativeblockchaincryptompc.cryptompc.Context;

import java.util.Base64;

@ReactModule(name = BlockchainCryptoMpcModule.NAME)
public class BlockchainCryptoMpcModule extends ReactContextBaseJavaModule {

  public static final String NAME = "BlockchainCryptoMpc";

  public BlockchainCryptoMpcModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @RequiresApi(api = Build.VERSION_CODES.O)
  @ReactMethod
  public void multiply(int a, int b, Promise promise) {
    try {

      Context client = Context.initGenerateEcdsaKey(1);
      Context server = Context.initGenerateEcdsaKey(2);

      String key1 = Base64.getEncoder().encodeToString(client.getResultBackupEcdsaKey());
      String key2 = Base64.getEncoder().encodeToString(server.getResultBackupEcdsaKey());
      promise.resolve(key1 + "    " + key2);

    } catch(Exception e) {
      Log.e(NAME, "Error while keying" + e);
    }

  }
}
