import{v as t}from"./lodash.b6d458a6.js";const s={cityName:"南京",cityId:"320100"};function i(){const s=t.get("city")||"",i=s.split("_")[0],c=s.split("_")[1];return i&&c?{cityId:i,cityName:c}:null}function c(s,i){t.set("city",`${s}_${i}`)}export{s as D,i as g,c as s};
//# sourceMappingURL=city.8ee0133b.js.map
