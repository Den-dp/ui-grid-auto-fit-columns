// Karma configuration
// Generated on Wed Oct 02 2019 09:06:54 GMT-0400 (Eastern Daylight Time)

module.exports = function (config) {
  const isCIBuild = !!process.env.CI;
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
    ],
    files: [
      // only specify one entry point
      // and require all tests in there
      'src/test.ts'
    ],
    exclude: [],
    preprocessors: {
      'src/test.ts': ['webpack', 'sourcemap'],
    },
    webpack: {
      mode: 'development',
      resolve: {
        extensions: ['.ts', '.js']
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.spec.json'
            }
          }
        ]
      },
      devtool: 'inline-source-map',
    },
    webpackMiddleware: {
      stats: 'errors-only'
    },
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [isCIBuild ? 'ChromeHeadless' : 'Chrome'],
    singleRun: isCIBuild,
    restartOnFileChange: true
  });
};
