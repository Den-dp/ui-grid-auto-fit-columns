// This file is required by karma.conf.js and loads recursively all the .spec and framework files

declare const require: any;

// Then we find all the tests.
export const context = require.context('./', true, /\.spec\.ts$/);

// And load the modules.
context.keys().forEach(context);
