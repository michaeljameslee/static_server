//tealium universal tag - utag.179 ut4.0.201706221933, Copyright 2017 Tealium.com Inc. All Rights Reserved.
try{(function(id,loader){var u={};utag.o[loader].sender[id]=u;if(utag===undefined){utag={};}if(utag.ut===undefined){utag.ut={};}if(utag.ut.loader===undefined){u.loader=function(o){var a,b,c,l;a=document;if(o.type==="iframe"){b=a.createElement("iframe");b.setAttribute("height","1");b.setAttribute("width","1");b.setAttribute("style","display:none");b.setAttribute("src",o.src);}else if(o.type==="img"){utag.DB("Attach img: "+o.src);b=new Image();b.src=o.src;return;}else{b=a.createElement("script");b.language="javascript";b.type="text/javascript";b.async=1;b.charset="utf-8";b.src=o.src;}if(o.id){b.id=o.id;}if(typeof o.cb==="function"){if(b.addEventListener){b.addEventListener("load",function(){o.cb();},false);}else{b.onreadystatechange=function(){if(this.readyState==="complete"||this.readyState==="loaded"){this.onreadystatechange=null;o.cb();}};}}l=o.loc||"head";c=a.getElementsByTagName(l)[0];if(c){utag.DB("Attach to "+l+": "+o.src);if(l==="script"){c.parentNode.insertBefore(b,c);}else{c.appendChild(b);}}};}else{u.loader=utag.ut.loader;}
u.ev={"view":1};u.map={};u.extend=[];u.send=function(a,b){if(u.ev[a]||u.ev.all!==undefined){var c,d,e,f;u.data={"qsp_delim":"&","kvp_delim":"=","base_url":"//beacon.sojern.com/pixel/p/XXXX","partner_id":"47"};c=[];for(d in utag.loader.GV(u.map)){if(b[d]!==undefined&&b[d]!==""){e=u.map[d].split(",");for(f=0;f<e.length;f++){if(u.data[e[f]]!==undefined){u.data[e[f]]=b[d];}else{c.push(e[f]+u.data.kvp_delim+encodeURIComponent(b[d]));u.data[e[f]]=encodeURIComponent(b[d]);}}}}
u.data.base_url=u.data.base_url.replace(/XXXX/,u.data.partner_id);u.loader({"type":"script","src":u.data.base_url+(c.length>0?"?"+c.join(u.data.qsp_delim):""),"cb":null,"loc":"script","id":"utag_179"});}};utag.o[loader].loader.LOAD(id);}("179","carlson.clubcarlson-crd"));}catch(error){utag.DB(error);}
