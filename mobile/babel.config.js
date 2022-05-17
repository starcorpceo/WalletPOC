module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["@babel/plugin-transform-flow-strip-types"],
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", { "loose": true }],
      ["module-resolver", {
        "alias": {
          "@Navigation": "./navigation",
          "@Components": "./components",
          "@Screens": "./screens",
          "@Assets": "./assets",
          "@Hooks": "./hooks",
          "@Constants": "./constants",
          "@Types": ".types",
        },
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
        ]
      }],
    ]
  };
};
