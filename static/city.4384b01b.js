import{O as s}from"./index.b2407a93.js";import{C as o}from"./storage.2d44022f.js";function r(){const t=s.get(o.City)||"",e=t.split("_")[0],i=t.split("_")[1];return e&&i?{cityId:e,cityName:i}:null}function l(t,e){s.set(o.City,`${t}_${e}`)}export{r as g,l as s};
//# sourceMappingURL=city.4384b01b.js.map
