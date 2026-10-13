const fs = require('fs');
const path = require('path');

// Reporter simple: guarda en logs/test-results.log el resultado de cada test
// y todo lo que se imprima con console.log durante la ejecución.
function FileLogReporter() {
  const dir = path.join(__dirname, 'logs');
  const archivo = path.join(dir, 'test-results.log');
  const lineas = [];

  this.onRunStart = () => {
    lineas.length = 0;
    lineas.push(`=== Ejecución de tests: ${new Date().toISOString()} ===`);
  };
  this.onBrowserLog = (browser, log, type) => {
    lineas.push(`  [${type}] ${String(log).replace(/^'|'$/g, '')}`);
  };
  this.onSpecComplete = (browser, result) => {
    const estado = result.skipped ? 'SKIP' : result.success ? 'PASS' : 'FAIL';
    lineas.push(`${estado} ${result.suite.join(' > ')} > ${result.description} (${result.time}ms)`);
    (result.log || []).forEach((l) => lineas.push(`    ${l.split('\n')[0]}`));
  };
  this.onRunComplete = (browsers, results) => {
    lineas.push(`--- Total: ${results.success} OK, ${results.failed} fallidos${results.error ? ', con errores' : ''} ---`);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(archivo, lineas.join('\n') + '\n');
  };
}

module.exports = function (config) {
  config.set({
    plugins: ['karma-*', { 'reporter:file-log': ['type', FileLogReporter] }],
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
    reporters: ['spec', 'coverage', 'file-log'],
    client: { captureConsole: true },
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
      FirefoxHeadlessCustom: {
        base: 'FirefoxHeadless',
        flags: ['-headless'],
      },
    },
    browsers: ['FirefoxHeadlessCustom'],
    singleRun: false,
  });
};
