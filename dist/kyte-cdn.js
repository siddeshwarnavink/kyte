/*!
 * Kyte v1.0.0
 *
 * By Siddeshwar Navinkumar <https://www.github.com/siddeshwarnavink>
 * Built on 1/4/2021, 4:23:58 PM
 */

(()=>{"use strict";var __webpack_modules__={715:(e,t,r)=>{function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}r.d(t,{F:()=>c,Z:()=>u});var c={changed:"changed"};const u=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),o(this,"isChannelOpen",!0),o(this,"subscribers",[]),this.value=t}var t,r;return t=e,(r=[{key:"subscribe",value:function(e,t){this.subscribers.push({event:e,callback:t})}},{key:"getVal",value:function(){return i({},this.value)}},{key:"mutate",value:function(e){var t=this;if(this.isChannelOpen){var r=i({},this.value);this.value=i({},e),this.subscribers.forEach((function(e){e.event===c.changed&&e.callback(t.value,r)}))}}},{key:"closeChannel",value:function(){this.isChannelOpen=!1}}])&&a(t.prototype,r),e}()},360:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _Observable__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(715),_util__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(499),_util__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(108),_util__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(425);function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _createSuper(e){var t=_isNativeReflectConstruct();return function(){var r,n=_getPrototypeOf(e);if(t){var i=_getPrototypeOf(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return _possibleConstructorReturn(this,r)}}function _possibleConstructorReturn(e,t){return!t||"object"!==_typeof(t)&&"function"!=typeof t?_assertThisInitialized(e):t}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _wrapNativeSuper(e){var t="function"==typeof Map?new Map:void 0;return(_wrapNativeSuper=function(e){if(null===e||!_isNativeFunction(e))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,r)}function r(){return _construct(e,arguments,_getPrototypeOf(this).constructor)}return r.prototype=Object.create(e.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(r,e)})(e)}function _construct(e,t,r){return(_construct=_isNativeReflectConstruct()?Reflect.construct:function(e,t,r){var n=[null];n.push.apply(n,t);var i=new(Function.bind.apply(e,n));return r&&_setPrototypeOf(i,r.prototype),i}).apply(null,arguments)}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function _isNativeFunction(e){return-1!==Function.toString.call(e).indexOf("[native code]")}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}}function _iterableToArray(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function ownKeys(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(r),!0).forEach((function(t){_defineProperty(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var Widget=function(){function Widget(){_classCallCheck(this,Widget),_defineProperty(this,"template",""),_defineProperty(this,"state",{}),_defineProperty(this,"attrs",{}),_defineProperty(this,"widgets",{}),_defineProperty(this,"refs",{}),_defineProperty(this,"$state",void 0),_defineProperty(this,"$attrs",void 0),_defineProperty(this,"_eventListeners",[]),_defineProperty(this,"_customWidgets",[]),_defineProperty(this,"_stringInterpolations",[])}return _createClass(Widget,[{key:"mounted",value:function(){}},{key:"onAttrsChange",value:function(){}},{key:"onStateChange",value:function(){}},{key:"updateState",value:function(e){var t=_objectSpread({},this.state);e(),this.$state.mutate(this.state),this.onStateChange(t)}},{key:"_initializePreCustomWidgetsReactivity",value:function _initializePreCustomWidgetsReactivity(){var classInst=this;function onLoop(domEl){for(var _loop=function _loop(i){var childEl=domEl.children[i],childElAttributes=_objectSpread({},childEl.attributes);(function(){var stringInterpolationExtractor=(0,_util__WEBPACK_IMPORTED_MODULE_1__.Z)(["{{","}}"]),extracts=stringInterpolationExtractor(classInst.template);extracts.length>0&&extracts.forEach((function(extract){var codeToRun=extract.substring(2,extract.length-2).replace("this.","classInst.").trim(),wrapperId="si_"+(0,_util__WEBPACK_IMPORTED_MODULE_2__.Z)(16);function update(){document.querySelector('kyte-container[id="'.concat(wrapperId,'"]'))&&(document.querySelector('kyte-container[id="'.concat(wrapperId,'"]')).innerHTML=eval(codeToRun))}childEl.innerHTML=childEl.innerHTML.replace(extract,'<kyte-container for="si" id="'.concat(wrapperId,'">').concat(eval(codeToRun),"</kyte-container>")),classInst._stringInterpolations.push({id:wrapperId,update}),classInst.$state.subscribe(_Observable__WEBPACK_IMPORTED_MODULE_0__.F.changed,update),classInst.$attrs.subscribe(_Observable__WEBPACK_IMPORTED_MODULE_0__.F.changed,update)}))})(),Object.keys(childElAttributes).forEach((function(attrKey){var currentAttribute=childElAttributes[attrKey];if("#"===currentAttribute.name.charAt(0)){var eventName=currentAttribute.name.substring(1);if(!classInst._eventListeners.find((function(e){return e.type===eventName&&e.element.innerHTML.trim()===childEl.innerHTML.trim()}))){var addEvent=function(e,t,r){r.addEventListener(e,t),classInst._eventListeners=[].concat(_toConsumableArray(classInst._eventListeners),[{type:e,onEmit:t,element:r}])};if("bind"===eventName){if((0,_util__WEBPACK_IMPORTED_MODULE_3__.Z)(classInst.template,childEl.outerHTML)){var statePieceName=currentAttribute.value.substring(1,currentAttribute.value.length-1).replace("this.","classInst.");childEl.value=eval(statePieceName),addEvent("input",(function(event){eval("\n                                         classInst.updateState(() => {\n                                             ".concat(statePieceName," = event.target.value;\n                                         })\n                                     ")),childEl.value=event.target.value}),childEl)}}else{var eventHandler=function eventHandler(event){var codeToRun="".concat(currentAttribute.value.substring(1,currentAttribute.value.length-1).replace("this.","classInst."),"(event)");eval(codeToRun)};addEvent(eventName,eventHandler,childEl)}}}})),childEl.children.length>0&&onLoop(childEl)},i=0;i<domEl.children.length;i++)_loop(i)}onLoop(this._root)}},{key:"_initializePostCustomWidgetsReactivity",value:function _initializePostCustomWidgetsReactivity(){var classInst=this;function onLoop(domEl){for(var _loop2=function _loop2(i){var childEl=domEl.children[i],childElAttributes=_objectSpread({},childEl.attributes);Object.keys(childElAttributes).forEach((function(attrKey){var currentAttribute=childElAttributes[attrKey];if("ref"===currentAttribute.name){var isCustomWidget=Object.keys(classInst.widgets).indexOf(childEl.localName)>-1;isCustomWidget?classInst._customWidgets.forEach((function(e){if(childEl.children[0].attributes.id.value===e.id){var t=e.instance;classInst.refs[currentAttribute.value]={dom:childEl,isCustomWidget:!0,widget:t}}})):classInst.refs[currentAttribute.value]={dom:childEl,isCustomWidget:!1}}else if("["===currentAttribute.name.charAt(0)&&currentAttribute.name.charAt(currentAttribute.name.length-1)){var actualName=currentAttribute.name.substring(1,currentAttribute.name.length-1),codeForActualValue=currentAttribute.value.replace("this.","classInst."),actualValue=eval(codeForActualValue),_isCustomWidget=Object.keys(classInst.widgets).indexOf(childEl.localName)>-1;_isCustomWidget?classInst._customWidgets.forEach((function(cWidget){if(childEl.children[0].attributes.id.value===cWidget.id){var updateWidgetAttr=function updateWidgetAttr(){var newCode=eval("".concat(codeForActualValue).replace("classInst.attrs","newAttrs")),oldAttr=_objectSpread({},widget.attrs),newAttr=_objectSpread({},oldAttr);newAttr[actualName]=newCode,widget.$attrs.mutate(newAttr)},widget=cWidget.instance,newAttr=_objectSpread({},widget.$attrs.getVal());newAttr[actualName]=actualValue,widget.$attrs.mutate(newAttr),widget.attrs=newAttr,classInst.$state.subscribe(_Observable__WEBPACK_IMPORTED_MODULE_0__.F.changed,updateWidgetAttr),classInst.$attrs.subscribe(_Observable__WEBPACK_IMPORTED_MODULE_0__.F.changed,updateWidgetAttr)}})):actualValue&&(childEl.setAttribute(actualName,actualValue),childEl.removeAttribute(currentAttribute.name))}else if(":"===currentAttribute.name.charAt(0)){var _actualName=currentAttribute.name.substring(1,currentAttribute.name.length);if(childEl.removeAttribute(currentAttribute.name),"if"===_actualName){var execureDirective=function execureDirective(){var isTrue;if(eval("isTrue = (".concat(currentAttribute.value.replace("this.","classInst."),") ? true: false")),isTrue){if(document.querySelector('kyte-placeholder[id="'.concat(replaceDummyId,'"]'))&&(document.querySelector('kyte-placeholder[id="'.concat(replaceDummyId,'"]')).replaceWith(childElCopy),innerStringInterpolation)){var innerStringInterpolationData=classInst._stringInterpolations.find((function(e){return e.id===innerStringInterpolation.id}));innerStringInterpolationData.update()}}else{var replaceDummy=document.createElement("kyte-placeholder");replaceDummy.setAttribute("id",replaceDummyId),childEl.replaceWith(replaceDummy)}},childElCopy=childEl,replaceDummyId=(0,_util__WEBPACK_IMPORTED_MODULE_2__.Z)(16),innerStringInterpolation=childEl.querySelector('kyte-container[for="si"]');execureDirective(),classInst.$state.subscribe(_Observable__WEBPACK_IMPORTED_MODULE_0__.F.changed,(function(){execureDirective()})),classInst.$attrs.subscribe(_Observable__WEBPACK_IMPORTED_MODULE_0__.F.changed,(function(){execureDirective()}))}else if("hide"===_actualName){var _execureDirective=function _execureDirective(){var isTrue;eval("isTrue = (".concat(currentAttribute.value.replace("this.","classInst."),") ? true: false")),childEl.style.display=isTrue?defaultDisplayType:"none"},defaultDisplayType=childEl.style.display;_execureDirective(),classInst.$state.subscribe(_Observable__WEBPACK_IMPORTED_MODULE_0__.F.changed,(function(){_execureDirective()})),classInst.$attrs.subscribe(_Observable__WEBPACK_IMPORTED_MODULE_0__.F.changed,(function(){_execureDirective()}))}}})),childEl.children.length>0&&onLoop(childEl)},i=0;i<domEl.children.length;i++)_loop2(i)}onLoop(this._root)}},{key:"_mountCustomWidgets",value:function(){var e=this;Object.keys(e.widgets).length>0&&Object.keys(e.widgets).forEach((function(t){customElements.get(t)||customElements.define(t,function(r){_inherits(i,r);var n=_createSuper(i);function i(){var r;_classCallCheck(this,i),r=n.call(this);var a=document.createElement("kyte-container"),o="cw_"+(0,_util__WEBPACK_IMPORTED_MODULE_2__.Z)(16),c=r.innerHTML.trim();r.innerHTML="",a.setAttribute("id",o),r.appendChild(a);for(var u={},s=0;s<r.attributes.length;s++){var l=r.attributes[s];u[l.name]=l.value}var _=new e.widgets[t];r.widget=_,_.$attrs=new _Observable__WEBPACK_IMPORTED_MODULE_0__.Z(u),_.attrs=_objectSpread({},u),_.mount(a,o);var p=a.querySelector("kyte-children");if(p){var d=document.createElement("kyte-container");d.innerHTML=c,p.replaceWith(d)}return r.children[0].replaceWith(a),e._customWidgets.push({instance:_,id:o}),r}return _createClass(i,[{key:"disconnectedCallback",value:function(){this.widget.unmount()}}]),i}(_wrapNativeSuper(HTMLElement)))}))}},{key:"mount",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;this._root=e,this._wrapperId=r,this.widgets=_objectSpread({},this.widgets),this.$state=new _Observable__WEBPACK_IMPORTED_MODULE_0__.Z(this.state),this.$state.subscribe(_Observable__WEBPACK_IMPORTED_MODULE_0__.F.changed,(function(e){var r=t.state;t.state=e,t.onStateChange(r,e)})),this.$attrs=new _Observable__WEBPACK_IMPORTED_MODULE_0__.Z(_objectSpread(_objectSpread({},this.defaultAttrs),this.attrs)),this.$attrs.subscribe(_Observable__WEBPACK_IMPORTED_MODULE_0__.F.changed,(function(e){var r=t.props;t.attrs=e,t.onAttrsChange(r,e)})),this._root.innerHTML=this.template,this._initializePreCustomWidgetsReactivity(),this._mountCustomWidgets(),this._initializePostCustomWidgetsReactivity(),this.mounted()}},{key:"unmount",value:function(){this.$state.closeChannel(),this.$attrs.closeChannel(),this._eventListeners.forEach((function(e){e.element.removeEventListener(e.type,e.onEmit)}))}}]),Widget}();const __WEBPACK_DEFAULT_EXPORT__=Widget},499:(e,t,r)=>{function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}r.d(t,{Z:()=>i});const i=function(e){var t,r,i=(r=2,function(e){if(Array.isArray(e))return e}(t=e)||function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var r=[],n=!0,i=!1,a=void 0;try{for(var o,c=e[Symbol.iterator]();!(n=(o=c.next()).done)&&(r.push(o.value),!t||r.length!==t);n=!0);}catch(e){i=!0,a=e}finally{try{n||null==c.return||c.return()}finally{if(i)throw a}}return r}}(t,r)||function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}(t,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),a=i[0],o=i[1],c=new RegExp("".concat(a,"(.*?)").concat(o),"gm");return function(e){return e.match(c)?e.match(c):[]}}},108:(e,t,r)=>{r.d(t,{Z:()=>n});const n=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:18,t="",r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=r.length,i=0;i<e;i++)t+=r.charAt(Math.floor(Math.random()*n));return t}},425:(e,t,r)=>{r.d(t,{Z:()=>n});const n=function(e,t){var r=new DOMParser,n=r.parseFromString(e,"text/html");n=n.querySelector("body").children[0];var i=r.parseFromString(t,"text/html");return i=i.querySelector("body").children[0],!!n.querySelector(i.localName)}}},__webpack_module_cache__={};function __webpack_require__(e){if(__webpack_module_cache__[e])return __webpack_module_cache__[e].exports;var t=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](t,t.exports,__webpack_require__),t.exports}__webpack_require__.d=(e,t)=>{for(var r in t)__webpack_require__.o(t,r)&&!__webpack_require__.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{function e(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function t(t){for(var n=1;n<arguments.length;n++){var i=null!=arguments[n]?arguments[n]:{};n%2?e(Object(i),!0).forEach((function(e){r(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):e(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}function r(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var i={root:"#app"};const a=function(){function e(r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),r=t(t({},i),r),this.mountApp(r.mount,r.root)}var r,a;return r=e,(a=[{key:"mountApp",value:function(e,t){e.mount(document.querySelector(t))}}])&&n(r.prototype,a),e}();var o=__webpack_require__(360),c=a;c.Widget=o.Z,window.Kyte=c})()})();