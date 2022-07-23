import{P as s}from"./index.8eff2da7.js";import{C as o}from"./storage.ab874d93.js";function r(){const t=s.get(o.City)||"",e=t.split("_")[0],i=t.split("_")[1];return e&&i?{cityId:e,cityName:i}:null}function l(t,e){s.set(o.City,`${t}_${e}`)}export{r as g,l as s};
//# sourceMappingURL=city.452f4acf.js.map
