(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"));
	else if(typeof define === 'function' && define.amd)
		define(["angular"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("angular")) : factory(root["angular"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var angular = __webpack_require__(1);
	var UiGridAutoFitColumnsService_1 = __webpack_require__(2);
	var UiGridAutoFitColumnsDirective_1 = __webpack_require__(17);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = angular.module('ui.grid.autoFitColumns', ['ui.grid'])
	    .service('uiGridAutoFitColumnsService', UiGridAutoFitColumnsService_1.UiGridAutoFitColumnsService)
	    .directive('uiGridAutoFitColumns', UiGridAutoFitColumnsDirective_1.UiGridAutoFitColumnsDirective)
	    .name;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var get = __webpack_require__(3);
	var Measurer_1 = __webpack_require__(15);
	var UiGridMetrics_1 = __webpack_require__(16);
	var UiGridAutoFitColumnsService = (function () {
	    /*@ngInject*/
	    UiGridAutoFitColumnsService.$inject = ["$q", "$filter"];
	    function UiGridAutoFitColumnsService($q, $filter) {
	        this.$q = $q;
	        this.$filter = $filter;
	        this.gridMetrics = new UiGridMetrics_1.default();
	    }
	    UiGridAutoFitColumnsService.prototype.initializeGrid = function (grid) {
	        grid.registerColumnBuilder(this.colAutoFitColumnBuilder.bind(this));
	        grid.registerColumnsProcessor(this.columnsProcessor.bind(this), 60);
	        UiGridAutoFitColumnsService.defaultGridOptions(grid.options);
	    };
	    UiGridAutoFitColumnsService.defaultGridOptions = function (gridOptions) {
	        // true by default
	        gridOptions.enableColumnAutoFit = gridOptions.enableColumnAutoFit !== false;
	    };
	    UiGridAutoFitColumnsService.prototype.getFilterIfExists = function (filterName) {
	        try {
	            return this.$filter(filterName);
	        }
	        catch (e) {
	            return null;
	        }
	    };
	    UiGridAutoFitColumnsService.prototype.getFilteredValue = function (value, cellFilter) {
	        if (cellFilter && cellFilter !== '') {
	            var filter = this.getFilterIfExists(cellFilter);
	            if (filter) {
	                value = filter(value);
	            }
	            else {
	                // https://regex101.com/r/rC5eR5/2
	                var re = /([^:]*):([^:]*):?([\s\S]+)?/;
	                var matches = void 0;
	                if ((matches = re.exec(cellFilter)) !== null) {
	                    value = this.$filter(matches[1])(value, matches[2], matches[3]);
	                }
	            }
	        }
	        return value;
	    };
	    UiGridAutoFitColumnsService.prototype.colAutoFitColumnBuilder = function (colDef, col, gridOptions) {
	        var promises = [];
	        if (colDef.enableColumnAutoFit === undefined) {
	            //TODO: make it as col.isResizable()
	            if (UiGridAutoFitColumnsService.isResizable(colDef)) {
	                colDef.enableColumnAutoFit = gridOptions.enableColumnAutoFit;
	            }
	            else {
	                colDef.enableColumnAutoFit = false;
	            }
	        }
	        return this.$q.all(promises);
	    };
	    UiGridAutoFitColumnsService.isResizable = function (colDef) {
	        return !colDef.hasOwnProperty('width');
	    };
	    UiGridAutoFitColumnsService.prototype.columnsProcessor = function (renderedColumnsToProcess, rows) {
	        var _this = this;
	        if (!rows.length) {
	            return renderedColumnsToProcess;
	        }
	        // TODO: respect existing colDef options
	        // if (col.colDef.enableColumnAutoFitting === false) return;
	        var optimalWidths = {};
	        renderedColumnsToProcess.forEach(function (column) {
	            if (column.colDef.enableColumnAutoFit) {
	                var columnKey_1 = column.field || column.name;
	                optimalWidths[columnKey_1] = Measurer_1.default.measureRoundedTextWidth(column.displayName, _this.gridMetrics.getHeaderFont()) + _this.gridMetrics.getHeaderButtonsWidth();
	                rows.forEach(function (row) {
	                    var cellText = get(row.entity, columnKey_1);
	                    if (!!column.colDef.cellFilter) {
	                        cellText = _this.getFilteredValue(cellText, column.colDef.cellFilter);
	                    }
	                    var currentCellWidth = Measurer_1.default.measureRoundedTextWidth(cellText, _this.gridMetrics.getCellFont());
	                    var optimalCellWidth = currentCellWidth > 300 ? 300 : currentCellWidth;
	                    if (optimalCellWidth > optimalWidths[columnKey_1]) {
	                        optimalWidths[columnKey_1] = optimalCellWidth;
	                    }
	                });
	                column.colDef.width = optimalWidths[columnKey_1] + _this.gridMetrics.getPadding() + _this.gridMetrics.getBorder();
	                column.updateColumnDef(column.colDef, false);
	            }
	        });
	        return renderedColumnsToProcess;
	    };
	    return UiGridAutoFitColumnsService;
	}());
	exports.UiGridAutoFitColumnsService = UiGridAutoFitColumnsService;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(4),
	    toPath = __webpack_require__(7);

	/**
	 * Gets the property value at `path` of `object`. If the resolved value is
	 * `undefined` the `defaultValue` is used in its place.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : baseGet(object, toPath(path), (path + ''));
	  return result === undefined ? defaultValue : result;
	}

	module.exports = get;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(5);

	/**
	 * The base implementation of `get` without support for string paths
	 * and default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} path The path of the property to get.
	 * @param {string} [pathKey] The key representation of path.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path, pathKey) {
	  if (object == null) {
	    return;
	  }
	  if (pathKey !== undefined && pathKey in toObject(object)) {
	    path = [pathKey];
	  }
	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[path[index++]];
	  }
	  return (index && index == length) ? object : undefined;
	}

	module.exports = baseGet;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(6);

	/**
	 * Converts `value` to an object if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  return isObject(value) ? value : Object(value);
	}

	module.exports = toObject;


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(8),
	    isArray = __webpack_require__(9);

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `value` to property path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Array} Returns the property path array.
	 */
	function toPath(value) {
	  if (isArray(value)) {
	    return value;
	  }
	  var result = [];
	  baseToString(value).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	}

	module.exports = toPath;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  return value == null ? '' : (value + '');
	}

	module.exports = baseToString;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(10),
	    isLength = __webpack_require__(14),
	    isObjectLike = __webpack_require__(13);

	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};

	module.exports = isArray;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(11);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	module.exports = getNative;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(12),
	    isObjectLike = __webpack_require__(13);

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = isNative;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(6);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 which returns 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	module.exports = isFunction;


/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	module.exports = isLength;


/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	var Measurer = (function () {
	    function Measurer() {
	    }
	    Measurer.measureTextWidth = function (text, font) {
	        var canvas = Measurer.canvas || (Measurer.canvas = document.createElement('canvas'));
	        var context = canvas.getContext('2d');
	        context.font = font;
	        var metrics = context.measureText(text);
	        return metrics.width;
	    };
	    Measurer.measureRoundedTextWidth = function (text, font) {
	        var width = Measurer.measureTextWidth(text, font);
	        return Math.floor(width) + 1;
	    };
	    return Measurer;
	}());
	exports.Measurer = Measurer;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Measurer;


/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	var UiGridMetrics = (function () {
	    function UiGridMetrics() {
	    }
	    UiGridMetrics.prototype.getHeaderFont = function () {
	        if (this.headerFont) {
	            return this.headerFont;
	        }
	        var header = document.querySelector('.ui-grid-header-cell .ui-grid-cell-contents');
	        if (!header) {
	            throw new Error('not found: .ui-grid-header-cell .ui-grid-cell-contents');
	        }
	        var headerStyle = getComputedStyle(header);
	        this.headerFont = UiGridMetrics.getFontStringFrom(headerStyle);
	        return this.headerFont;
	    };
	    UiGridMetrics.prototype.getCellFont = function () {
	        if (this.cellFont) {
	            return this.cellFont;
	        }
	        var cell = document.querySelector('.ui-grid-cell > .ui-grid-cell-contents');
	        if (!cell) {
	            var element = document.createElement('div');
	            element.className = 'ui-grid-cell-contents';
	            element.style.cssFloat = 'left';
	            angular.element(document.body).append(element);
	            var cellStyle_1 = getComputedStyle(element);
	            this.cellFont = UiGridMetrics.getFontStringFrom(cellStyle_1);
	            angular.element(element).remove();
	            return this.cellFont;
	        }
	        var cellStyle = getComputedStyle(cell);
	        this.cellFont = UiGridMetrics.getFontStringFrom(cellStyle);
	        return this.cellFont;
	    };
	    UiGridMetrics.prototype.getPadding = function () {
	        if (this.padding) {
	            return this.padding;
	        }
	        var header = document.querySelector('.ui-grid-header-cell .ui-grid-cell-contents');
	        if (!header) {
	            throw new Error('not found: .ui-grid-header-cell .ui-grid-cell-contents');
	        }
	        var _a = getComputedStyle(header), paddingLeft = _a.paddingLeft, paddingRight = _a.paddingRight;
	        this.padding = parseInt(paddingLeft) + parseInt(paddingRight);
	        return this.padding;
	    };
	    UiGridMetrics.prototype.getBorder = function () {
	        if (this.border) {
	            return this.border;
	        }
	        var header = document.querySelector('.ui-grid-header-cell');
	        if (!header) {
	            throw new Error('not found: .ui-grid-header-cell');
	        }
	        var borderRightWidth = getComputedStyle(header).borderRightWidth;
	        this.border = parseInt(borderRightWidth);
	        return this.border;
	    };
	    UiGridMetrics.prototype.getHeaderButtonsWidth = function () {
	        // TODO: lets be more precise
	        var HEADER_BUTTONS_WIDTH = 25;
	        return HEADER_BUTTONS_WIDTH;
	    };
	    UiGridMetrics.getFontStringFrom = function (_a) {
	        var fontStyle = _a.fontStyle, fontVariant = _a.fontVariant, fontWeight = _a.fontWeight, fontSize = _a.fontSize, fontFamily = _a.fontFamily;
	        // in FF cssStyle.font may be '' so we need to collect it manually
	        // font: [font-style||font-variant||font-weight] font-size [/line-height] font-family | inherit
	        return fontStyle + " " + fontVariant + " " + fontWeight + " " + fontSize + " " + fontFamily;
	    };
	    return UiGridMetrics;
	}());
	exports.UiGridMetrics = UiGridMetrics;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = UiGridMetrics;


/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	/*@ngInject*/
	UiGridAutoFitColumnsDirective.$inject = ["uiGridAutoFitColumnsService"];
	function UiGridAutoFitColumnsDirective(uiGridAutoFitColumnsService) {
	    return {
	        replace: true,
	        priority: 0,
	        require: '^uiGrid',
	        scope: false,
	        compile: function () {
	            return {
	                pre: function ($scope, $elm, $attrs, uiGridCtrl) {
	                    uiGridAutoFitColumnsService.initializeGrid(uiGridCtrl.grid);
	                }
	            };
	        }
	    };
	}
	exports.UiGridAutoFitColumnsDirective = UiGridAutoFitColumnsDirective;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=autoFitColumns.js.map