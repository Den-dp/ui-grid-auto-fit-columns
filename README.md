# ui-grid-auto-fit-columns

[![Build Status](https://img.shields.io/travis/Den-dp/ui-grid-auto-fit-columns.svg?style=flat-square)](https://travis-ci.org/Den-dp/ui-grid-auto-fit-columns)
[![version](https://img.shields.io/npm/v/ui-grid-auto-fit-columns.svg?style=flat-square)](https://www.npmjs.com/package/ui-grid-auto-fit-columns)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![devDependency Status](https://img.shields.io/david/dev/den-dp/ui-grid-auto-fit-columns.svg?style=flat-square)](https://david-dm.org/den-dp/ui-grid-auto-fit-columns#info=devDependencies)

The plugin ensures that the column width will be wide enough for showing the longest data of that column (or column name).

## Demo

[http://jsbin.com/tufazaw/edit?js,output](http://jsbin.com/tufazaw/edit?js,output)

## Installation

This package is distributed via npm:

```
npm install ui-grid-auto-fit-columns -S
```

## Usage

```html
<div ui-grid="gridOptions" ui-grid-auto-fit-columns></div>
```

```javascript
angular.module('app', ['ui.grid', 'ui.grid.autoFitColumns'])
```

## Contributing
[conventional-changelog](https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md)
