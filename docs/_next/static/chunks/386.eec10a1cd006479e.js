!function(){var e,_,r,t,i={},a={};function __webpack_require__(e){var _=a[e];if(void 0!==_)return _.exports;var r=a[e]={exports:{}},t=!0;try{i[e](r,r.exports,__webpack_require__),t=!1}finally{t&&delete a[e]}return r.exports}__webpack_require__.m=i,__webpack_require__.d=function(e,_){for(var r in _)__webpack_require__.o(_,r)&&!__webpack_require__.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:_[r]})},__webpack_require__.f={},__webpack_require__.e=function(e){return Promise.all(Object.keys(__webpack_require__.f).reduce(function(_,r){return __webpack_require__.f[r](e,_),_},[]))},__webpack_require__.u=function(e){return"static/chunks/"+e+".86822a4d92b4b6d1.js"},__webpack_require__.miniCssF=function(e){},__webpack_require__.o=function(e,_){return Object.prototype.hasOwnProperty.call(e,_)},__webpack_require__.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},__webpack_require__.U=function(e){var _=new URL(e,"x:/"),r={};for(var t in _)r[t]=_[t];for(var t in r.href=e,r.pathname=e.replace(/[?#].*/,""),r.origin=r.protocol="",r.toString=r.toJSON=function(){return e},r)Object.defineProperty(this,t,{enumerable:!0,configurable:!0,value:r[t]})},__webpack_require__.U.prototype=URL.prototype,__webpack_require__.tt=function(){return void 0===e&&(e={createScriptURL:function(e){return e}},"undefined"!=typeof trustedTypes&&trustedTypes.createPolicy&&(e=trustedTypes.createPolicy("nextjs#bundler",e))),e},__webpack_require__.tu=function(e){return __webpack_require__.tt().createScriptURL(e)},__webpack_require__.p="/wasm-demo/_next/",_={386:1},__webpack_require__.f.i=function(e,r){_[e]||importScripts(__webpack_require__.tu(__webpack_require__.p+__webpack_require__.u(e)))},t=(r=self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push.bind(r),r.push=function(e){var r=e[0],i=e[1],a=e[2];for(var n in i)__webpack_require__.o(i,n)&&(__webpack_require__.m[n]=i[n]);for(a&&a(__webpack_require__);r.length;)_[r.pop()]=1;t(e)};let n=self;n.addEventListener("message",async e=>{let _=await __webpack_require__.e(130).then(__webpack_require__.bind(__webpack_require__,6130));await _.default();let[r,t]=e.data;(await _.Archive.extract_to_entries(r)).array().map(async(e,_)=>{let r=e.name();try{if(e.is_encrypted()){let i=await e.extract(t),a=new File([i],r);n.postMessage([_,a])}else{let t=await e.extract(),i=new File([t],r);n.postMessage([_,i])}}catch(e){console.error(e)}})}),_N_E={}}();