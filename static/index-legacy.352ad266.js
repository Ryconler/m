!function(){function t(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==n)return;var r,o,i=[],a=!0,u=!1;try{for(n=n.call(t);!(a=(r=n.next()).done)&&(i.push(r.value),!e||i.length!==e);a=!0);}catch(l){u=!0,o=l}finally{try{a||null==n.return||n.return()}finally{if(u)throw o}}return i}(t,e)||n(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function e(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=n(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var o=0,i=function(){};return{s:i,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u=!0,l=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return u=t.done,t},e:function(t){l=!0,a=t},f:function(){try{u||null==r.return||r.return()}finally{if(l)throw a}}}}function n(t,e){if(t){if("string"==typeof t)return r(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(t,e):void 0}}function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var o=document.createElement("style");o.innerHTML='html,body{width:100%;height:100%}body{background-position:center;background-size:cover;background-repeat:no-repeat;background-attachment:fixed}#app *{box-sizing:border-box}.clearfix:after{display:block;clear:both;visibility:hidden;height:0;overflow:hidden;content:""}html,body{-webkit-font-smoothing:antialiased;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol}body{outline:0;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;-webkit-text-size-adjust:100%;line-height:1;font-size:.16rem}article,aside,blockquote,body,button,code,dd,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,input,legend,li,menu,nav,ol,p,pre,section,td,textarea,th,ul{margin:0;padding:0}h1,h2,h3,h4,h5,h6{font-weight:400}a,ins{text-decoration:none}a{color:#333}em,i{font-style:normal}table{border-collapse:collapse;border-spacing:0}caption,th{text-align:left}li{list-style:none}del{text-decoration:line-through}button,input,optgroup,option,select,textarea{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;outline:0}button,fieldset,img{border:0;max-width:100%}button{-webkit-appearance:none;background:0 0}input::-webkit-inner-spin-button,input::-webkit-outer-spin-button{-webkit-appearance:none!important;margin:0}input[type=number]{-moz-appearance:textfield}input[type=search]::-webkit-search-cancel-button{-webkit-appearance:none}input::-webkit-input-placeholder{color:#999}\n',document.head.appendChild(o),System.register(["./vendor-legacy.b50a78d2.js"],(function(n,r){"use strict";var o,i,a,u,l,c,f,h,p,s,d;return{setters:[function(t){o=t.d,i=t.r,a=t.c,u=t.w,l=t.o,c=t.K,f=t.a,h=t.b,p=t.e,s=t.f,d=t.g}],execute:function(){var b=n("_",(function(n,r){var o,i=e(r);try{for(i.s();!(o=i.n()).done;){var a=t(o.value,2),u=a[0],l=a[1];n[u]=l}}catch(c){i.e(c)}finally{i.f()}return n}))(o({}),[["render",function(t,e,n,r,o,h){var p=i("router-view");return t.$route.meta.keepAlive?(l(),a(p,{key:0},{default:u((function(t){var e=t.Component;return[(l(),a(c,null,[(l(),a(f(e)))],1024))]})),_:1})):(l(),a(p,{key:1}))}]]),m=function(t,e){return t()},y=h({routes:[{path:"/",name:"home",component:function(){return m((function(){return r.import("./Home-legacy.64b2922a.js")}))}},{path:"/city-choose",name:"cityChoose",component:function(){return m((function(){return r.import("./CityChoose-legacy.b513e3b3.js")}))}},{path:"/search",name:"search",component:function(){return m((function(){return r.import("./Search-legacy.7e182784.js")}))}},{path:"/photography",name:"photography",component:function(){return m((function(){return r.import("./Photography-legacy.a2120eb1.js")}))}}],history:p("/")}),g=s({state:{},getters:{},mutations:{},actions:{}});var v=d(b);!function(t){t.mixin({})}(v),v.use(g).use(y).mount("#app")}}}))}();
//# sourceMappingURL=index-legacy.352ad266.js.map
