module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        extensions: [".ts", ".tsx", "js", "jsx"],
        root: ["./app"],
        alias: {
          lib: "./app/lib",
          state: "./app/state",
        },
      },
    ],
  ],
};
