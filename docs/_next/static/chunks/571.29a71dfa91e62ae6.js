!function(){var e,t,r,n,o={},i={};function a(e){var t=i[e];if(void 0!==t)return t.exports;var r=i[e]={exports:{}},n=!0;try{o[e](r,r.exports,a),n=!1}finally{n&&delete i[e]}return r.exports}a.m=o,a.d=function(e,t){for(var r in t)a.o(t,r)&&!a.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},a.f={},a.e=function(e){return Promise.all(Object.keys(a.f).reduce(function(t,r){return a.f[r](e,t),t},[]))},a.u=function(e){return"static/chunks/"+e+".dde3e713edba89cc.js"},a.miniCssF=function(e){},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.U=function(e){var t=new URL(e,"x:/"),r={};for(var n in t)r[n]=t[n];for(var n in r.href=e,r.pathname=e.replace(/[?#].*/,""),r.origin=r.protocol="",r.toString=r.toJSON=function(){return e},r)Object.defineProperty(this,n,{enumerable:!0,configurable:!0,value:r[n]})},a.U.prototype=URL.prototype,a.tt=function(){return void 0===e&&(e={createScriptURL:function(e){return e}},"undefined"!=typeof trustedTypes&&trustedTypes.createPolicy&&(e=trustedTypes.createPolicy("nextjs#bundler",e))),e},a.tu=function(e){return a.tt().createScriptURL(e)},a.p="/wasm-demo/_next/",t={571:1},a.f.i=function(e,r){t[e]||importScripts(a.tu(a.p+a.u(e)))},n=(r=self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push.bind(r),r.push=function(e){var r=e[0],o=e[1],i=e[2];for(var u in o)a.o(o,u)&&(a.m[u]=o[u]);for(i&&i(a);r.length;)t[r.pop()]=1;n(e)};let u=self;u.addEventListener("message",async e=>{let t=await a.e(141).then(a.bind(a,2141));await t.default();let[r,n]=e.data;(await t.Archive.extract_to_entries(r)).array().map(async(e,t)=>{let r=e.name();try{if(e.is_encrypted()){let o=await e.extract(n),i=new File([o],r);u.postMessage([t,i])}else{let n=await e.extract(),o=new File([n],r);u.postMessage([t,o])}}catch(e){console.error(e)}})}),_N_E={}}();