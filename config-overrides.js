const path = require('path');
const webpack = require('webpack');
const { PiralInstanceWebpackPlugin } = require('piral-instance-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const piralPkg = require('./package.json');

module.exports = {
    // The Webpack config to use when compiling your react app for development or production.
    webpack: function (config, env) {
        console.log('RUNNING react-app-rewired!')
      config.resolve = {
        ...config.resolve,
        alias: { '@': path.resolve(__dirname, 'src') },
      };
  
      const EnvironmentPlugin = webpack.EnvironmentPlugin;
      config.plugins.push(new EnvironmentPlugin({ AS_VERSION: piralPkg.version }));
  
      config.plugins.push(
        new CircularDependencyPlugin({
          exclude: /node_modules/,
          failOnError: true,
          allowAsyncCycles: false,
          cwd: process.cwd(),
        }),
      );
  
      // Configure PiralInstanceWebpackPlugin
      const excludedDependencies = ['piral', 'piral-core', 'piral-base', piralPkg.name];
      const dependencies =
        piralPkg.pilets && piralPkg.pilets.externals ? piralPkg.pilets.externals : [];
      const externals = dependencies.filter((m) => !excludedDependencies.includes(m));
  
      config.plugins.push(
        new PiralInstanceWebpackPlugin({
          name: piralPkg.name,
          version: piralPkg.version,
          debug: false,
          emulator: false,
          externals,
        }),
      );
  
      // Configure parcel-codegen-loader.
      config.module.rules.unshift({
        test: /\.codegen$/i,
        use: [
          {
            loader: 'parcel-codegen-loader',
          },
        ],
      });

      return config;
    }
}