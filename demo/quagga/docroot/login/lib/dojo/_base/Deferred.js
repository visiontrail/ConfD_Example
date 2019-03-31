/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

//>>built
define("dojo/_base/Deferred","./kernel ../Deferred ../promise/Promise ../errors/CancelError ../has ./lang ../when".split(" "),function(c,g,y,z,u,h,A){var s=function(){},B=Object.freeze||function(){},r=c.Deferred=function(c){function p(a){if(k)throw Error("This deferred has already been resolved");l=a;k=!0;v()}function v(){for(var a;!a&&e;){var b=e;e=e.next;if(a=b.progress==s)k=!1;var d=m?b.error:b.resolved;u("config-useDeferredInstrumentation")&&m&&g.instrumentRejected&&g.instrumentRejected(l,!!d);
if(d)try{var n=d(l);n&&"function"===typeof n.then?n.then(h.hitch(b.deferred,"resolve"),h.hitch(b.deferred,"reject"),h.hitch(b.deferred,"progress")):(d=a&&void 0===n,a&&!d&&(m=n instanceof Error),b.deferred[d&&m?"reject":"resolve"](d?l:n))}catch(c){b.deferred.reject(c)}else m?b.deferred.reject(l):b.deferred.resolve(l)}}var l,k,w,q,m,t,e,f=this.promise=new y;this.isResolved=f.isResolved=function(){return 0==q};this.isRejected=f.isRejected=function(){return 1==q};this.isFulfilled=f.isFulfilled=function(){return 0<=
q};this.isCanceled=f.isCanceled=function(){return w};this.resolve=this.callback=function(a){this.fired=q=0;this.results=[a,null];p(a)};this.reject=this.errback=function(a){m=!0;this.fired=q=1;u("config-useDeferredInstrumentation")&&g.instrumentRejected&&g.instrumentRejected(a,!!e);p(a);this.results=[null,a]};this.progress=function(a){for(var b=e;b;){var d=b.progress;d&&d(a);b=b.next}};this.addCallbacks=function(a,b){this.then(a,b,s);return this};f.then=this.then=function(a,b,d){var c=d==s?this:new r(f.cancel);
a={resolved:a,error:b,progress:d,deferred:c};e?t=t.next=a:e=t=a;k&&v();return c.promise};var x=this;f.cancel=this.cancel=function(){if(!k){var a=c&&c(x);k||(a instanceof Error||(a=new z(a)),a.log=!1,x.reject(a))}w=!0};B(f)};h.extend(r,{addCallback:function(g){return this.addCallbacks(h.hitch.apply(c,arguments))},addErrback:function(g){return this.addCallbacks(null,h.hitch.apply(c,arguments))},addBoth:function(g){var p=h.hitch.apply(c,arguments);return this.addCallbacks(p,p)},fired:-1});r.when=c.when=
A;return r});
//# sourceMappingURL=Deferred.js.map