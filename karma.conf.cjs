module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    files: ['src/**/*.spec.jsx', 'src/**/*.spec.js'],
    preprocessors: {
      'src/**/*.spec.jsx': ['webpack'],
      'src/**/*.spec.js': ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                plugins: [['istanbul', { exclude: ['**/*.spec.js', '**/*.spec.jsx'] }]],
              },
            },
          },
          { test: /\.css$/, use: ['style-loader', 'css-loader'] },
          { test: /\.(png|jpe?g|gif|svg|webp)$/, type: 'asset/resource' },
        ],
      },
    },
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    browsers: ['ChromeHeadlessNoSandbox'],
    singleRun: false,
  });
};
