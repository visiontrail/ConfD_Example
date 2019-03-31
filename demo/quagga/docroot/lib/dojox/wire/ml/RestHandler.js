//>>built
define("dojox/wire/ml/RestHandler",["dijit","dojo","dojox","dojo/require!dojox/wire/_base,dojox/wire/ml/util"],function(k,d,l){d.provide("dojox.wire.ml.RestHandler");d.require("dojox.wire._base");d.require("dojox.wire.ml.util");d.declare("dojox.wire.ml.RestHandler",null,{contentType:"text/plain",handleAs:"text",bind:function(a,b,e,c){a=a.toUpperCase();var h=this;c={url:this._getUrl(a,b,c),contentType:this.contentType,handleAs:this.handleAs,headers:this.headers,preventCache:this.preventCache};var f=
null;"POST"==a?(c.postData=this._getContent(a,b),f=d.rawXhrPost(c)):"PUT"==a?(c.putData=this._getContent(a,b),f=d.rawXhrPut(c)):f="DELETE"==a?d.xhrDelete(c):d.xhrGet(c);f.addCallbacks(function(a){e.callback(h._getResult(a))},function(a){e.errback(a)})},_getUrl:function(a,b,e){var c;"GET"==a||"DELETE"==a?0<b.length&&(c=b[0]):1<b.length&&(c=b[1]);if(c){a="";for(var d in c)if(b=c[d]){b=encodeURIComponent(b);var f="{"+d+"}",g=e.indexOf(f);0<=g?e=e.substring(0,g)+b+e.substring(g+f.length):(a&&(a+="\x26"),
a+=d+"\x3d"+b)}a&&(e+="?"+a)}return e},_getContent:function(a,b){return"POST"==a||"PUT"==a?b?b[0]:null:null},_getResult:function(a){return a}})});
//# sourceMappingURL=RestHandler.js.map