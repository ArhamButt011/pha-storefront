import{j as e}from"./jsx-runtime-BrqPdJ8F.js";import{c as r}from"./cn-DaoVIXo8.js";/**
 * @license lucide-react v1.41.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=[["path",{d:"M5 12h14",key:"1ays0h"}]],i=r("minus",n);/**
 * @license lucide-react v1.41.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],d=r("plus",c);function m({value:t,onChange:s,min:o=1,max:a=99}){return e.jsxs("div",{className:"flex shrink-0 items-center rounded-full border border-border bg-bg-2",children:[e.jsx("button",{type:"button",onClick:()=>s(Math.max(o,t-1)),className:"flex h-11 w-11 items-center justify-center text-fg-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-40",disabled:t<=o,"aria-label":"Decrease quantity",children:e.jsx(i,{className:"h-4 w-4"})}),e.jsx("span",{className:"w-8 text-center text-sm font-semibold text-fg",children:t}),e.jsx("button",{type:"button",onClick:()=>s(Math.min(a,t+1)),className:"flex h-11 w-11 items-center justify-center text-fg-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-40",disabled:t>=a,"aria-label":"Increase quantity",children:e.jsx(d,{className:"h-4 w-4"})})]})}export{m as Q};
