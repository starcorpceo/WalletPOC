module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        extensions: [".ts", ".tsx", "js", "jsx", ".d.ts"],
        root: ["./app"],
        alias: {
          lib: "./app/lib/",
          "api-types": "./app/api-types/",
          shared: "./app/shared/",
          state: "./app/state/",
          bitcoin: "./app/wallet/assets/bitcoin/",
          ethereum: "./app/wallet/assets/ethereum/",
          wallet: "./app/wallet/",
          config: "./app/config/",
          packages: "./packages/",
          shim: "./shim.js",
        },
      },
    ],
  ],
};
