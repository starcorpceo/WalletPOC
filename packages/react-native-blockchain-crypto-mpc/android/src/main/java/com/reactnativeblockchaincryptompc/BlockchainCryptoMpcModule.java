package com.reactnativeblockchaincryptompc;

import static com.reactnativeblockchaincryptompc.Test.testClientServer;
import static com.reactnativeblockchaincryptompc.Test.testEcdsaGen;

import android.os.Build;
import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.security.Signature;
import java.security.interfaces.ECPublicKey;
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
      // Generating Keypairs for clinet and server
      Test.TestShare testKey = testEcdsaGen();

      // Messageto sign
      byte[] test = "123456".getBytes();

      // Establish client and server
      Test.TestContext testContext = new Test.TestContext();
      testContext.client = testKey.client.initEcdsaSign(1, test, true);
      testContext.server = testKey.server.initEcdsaSign(2, test, true);
      testClientServer(testKey, testContext);

      // Create Signature
      byte[] signature = testContext.client.getResultEcdsaSign();


      // Un-Comment line bellow and replace testKey. with wrongKey. to check if verification fails with a wrong key
      // Test.TestShare wrongKey = testEcdsaGen();


      // Verify Signature
      ECPublicKey pubKey = testKey.client.getEcdsaPublic();
      Signature sig = Signature.getInstance("NoneWithECDSA", new BouncyCastleProvider());
      sig.initVerify(pubKey);
      sig.update(test);

      if (!sig.verify(signature))
      {
        throw new Exception("verifyEcdsa failed");
      }

      promise.resolve("signing ok " + Base64.getEncoder().encodeToString(signature));

    } catch (Exception e) {
      promise.resolve("Error while verifying signature: " +e.getMessage());
    }
  }

}
