(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[572],{6394:function(e,t,n){Promise.resolve().then(n.bind(n,7232))},5373:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return dynamic}});let r=n(1024);n(2265);let a=r._(n(7075));function convertModule(e){return{default:(null==e?void 0:e.default)||e}}function dynamic(e,t){let n=a.default,r={loading:e=>{let{error:t,isLoading:n,pastDelay:r}=e;return null}};"function"==typeof e&&(r.loader=e),Object.assign(r,t);let l=r.loader;return n({...r,loader:()=>null!=l?l().then(convertModule):Promise.resolve(convertModule(()=>null))})}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},9167:function(e,t,n){"use strict";function NoSSR(e){let{children:t}=e;return t}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"NoSSR",{enumerable:!0,get:function(){return NoSSR}}),n(1283)},7075:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return i}});let r=n(1024),a=r._(n(2265)),l=n(9167);function Loadable(e){let t=Object.assign({loader:null,loading:null,ssr:!0},e);function LoadableComponent(e){let n=t.loading,r=a.default.createElement(n,{isLoading:!0,pastDelay:!0,error:null}),i=t.ssr?a.default.Fragment:l.NoSSR,o=t.lazy;return a.default.createElement(a.default.Suspense,{fallback:r},a.default.createElement(i,null,a.default.createElement(o,e)))}return t.lazy=a.default.lazy(t.loader),LoadableComponent.displayName="LoadableComponent",LoadableComponent}let i=Loadable},7232:function(e,t,n){"use strict";n.r(t);var r=n(7437),a=n(3368),l=n.n(a),i=n(290),o=n(4160),s=n(2265),u=n(1729),c=n(5373),d=n.n(c),f=n(8686);function Create(e){let t=(0,s.useRef)(null),[n,a]=(0,s.useState)(null),[c,d]=(0,s.useState)([]);function preventDefaults(e){e.preventDefault(),e.stopPropagation()}function handleDrop(e){preventDefaults(e);let t=e.dataTransfer.files;addItems(t)}function addItems(e){d([...c,...Array.from(e)])}return(0,r.jsxs)("main",{className:l().main,children:[(0,r.jsx)(o.Z,{href:"../"}),(0,r.jsx)("h1",{className:l().h1,children:"Create PNA Archive"}),(0,r.jsxs)(u.Z,{onDragEnter:preventDefaults,onDragLeave:preventDefaults,onDragOver:preventDefaults,onDrop:handleDrop,onClick:()=>{var e;null===(e=t.current)||void 0===e||e.click()},children:[(0,r.jsx)("ul",{className:l().ul,children:0===c.length?(0,r.jsx)("li",{children:(0,r.jsx)("label",{htmlFor:"file",children:"Drop your files here!"})}):c.map(e=>(0,r.jsxs)("li",{className:l().li,children:[(0,r.jsx)("span",{className:l()["file-name"],children:e.name}),(0,r.jsxs)("span",{className:l()["file-size"],children:[e.size," B"]})]},e.name))}),(0,r.jsx)("input",{ref:t,id:"file",type:"file",multiple:!0,onChange:e=>{let t=e.target.files;t&&addItems(t)}})]}),(0,r.jsx)(i.Z,{title:"Create",disabled:0===c.length,onClick:async()=>{let t=await Promise.all(c.map(async e=>{let t=new Uint8Array(await e.arrayBuffer());return{name:e.name,data:t}})),n=new Map(t.map(e=>[e.name,e.data])),r=e.create(n);a(r)}}),n&&(0,r.jsx)("div",{children:(0,r.jsx)("ul",{className:l()["link-card-grid"],children:(0,r.jsx)(f.Z,{href:URL.createObjectURL(new Blob([n])),title:"Download",rightIcon:(0,r.jsx)("span",{children:"↓"}),body:"archive.pna : "+n.length+"bytes",download:"archive.pna"})})})]})}t.default=d()(async()=>{let e=await n.e(879).then(n.bind(n,7879));return e.default(),()=>Create(e)},{loadableGenerated:{webpack:()=>[7879]},ssr:!1})},4160:function(e,t,n){"use strict";var r=n(7437),a=n(234),l=n.n(a);t.Z=e=>{let{href:t}=e;return(0,r.jsx)("a",{href:t,className:l()["return-link"],children:(0,r.jsx)("span",{children:"←"})})}},290:function(e,t,n){"use strict";var r=n(7437),a=n(8028),l=n.n(a);t.Z=e=>{let{title:t,...n}=e;return(0,r.jsx)("input",{className:l().button,type:"button",value:t,...n})}},8686:function(e,t,n){"use strict";var r=n(7437);n(2265);var a=n(8919),l=n.n(a);t.Z=e=>{let{body:t,href:n,title:a,download:i,rightIcon:o}=e;return(0,r.jsx)("li",{className:l()["link-card"],children:(0,r.jsxs)("a",{href:n,download:i,children:[(0,r.jsxs)("h2",{className:l().h2,children:[a,o||(0,r.jsx)("span",{children:"→"})]}),(0,r.jsx)("p",{className:l().p,children:t})]})})}},1729:function(e,t,n){"use strict";var r=n(7437),a=n(2518),l=n.n(a);t.Z=e=>{let{...t}=e;return(0,r.jsx)("div",{className:l()["drop-area"],...t})}},3368:function(e){e.exports={main:"page_main__ittxr",h1:"page_h1__NSYSj",ul:"page_ul__izoJa",li:"page_li__c5_uB","file-name":"page_file-name__OxMCc","file-size":"page_file-size__998F8","link-card-grid":"page_link-card-grid__Lr6_i"}},234:function(e){e.exports={"return-link":"BackButtom_return-link__zTFIU"}},8028:function(e){e.exports={button:"Button_button__aJ0V6"}},8919:function(e){e.exports={"link-card":"Card_link-card__rHdPc",h2:"Card_h2__5iUOY",p:"Card_p___uVKK"}},2518:function(e){e.exports={"drop-area":"DropArea_drop-area__MH18u"}},622:function(e,t,n){"use strict";/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(2265),a=Symbol.for("react.element"),l=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),i=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,o={key:!0,ref:!0,__self:!0,__source:!0};function q(e,t,n){var r,s={},u=null,c=null;for(r in void 0!==n&&(u=""+n),void 0!==t.key&&(u=""+t.key),void 0!==t.ref&&(c=t.ref),t)l.call(t,r)&&!o.hasOwnProperty(r)&&(s[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps)void 0===s[r]&&(s[r]=t[r]);return{$$typeof:a,type:e,key:u,ref:c,props:s,_owner:i.current}}t.jsx=q,t.jsxs=q},7437:function(e,t,n){"use strict";e.exports=n(622)}},function(e){e.O(0,[971,472,744],function(){return e(e.s=6394)}),_N_E=e.O()}]);