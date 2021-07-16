const { alias } = require("react-app-rewire-alias");

module.exports = {
  webpack: (config, env) => {
    alias({
      "@components": "./src/components",
      "@assets": "./src/assets",
      "@features": "./src/features",
      "@util": "./util/",
    })(config);

    return config;
  },
};
