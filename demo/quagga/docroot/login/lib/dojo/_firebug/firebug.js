/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

//>>built
define("dojo/_firebug/firebug","../_base/kernel require ../_base/html ../sniff ../_base/array ../_base/lang ../_base/event ../_base/unload".split(" "),function(h,ca,V,q){function x(a){B=a||!B;m&&(m.style.display=B?"block":"none")}function da(a,b,c,d){(a=window.open("","_firebug","status\x3d0,menubar\x3d0,resizable\x3d1,top\x3d"+b+",left\x3d"+a+",width\x3d"+c+",height\x3d"+d+",scrollbars\x3d1,addressbar\x3d0"))||alert("Firebug Lite could not open a pop-up window, most likely because of a blocker.\nEither enable pop-ups for this domain, or change the djConfig to popup\x3dfalse.");
ea(a);b=a.document;b.write('\x3chtml style\x3d"height:100%;"\x3e\x3chead\x3e\x3ctitle\x3eFirebug Lite\x3c/title\x3e\x3c/head\x3e\n\x3cbody bgColor\x3d"#ccc" style\x3d"height:97%;" onresize\x3d"opener.onFirebugResize()"\x3e\n\x3cdiv id\x3d"fb"\x3e\x3c/div\x3e\x3c/body\x3e\x3c/html\x3e');b.close();return a}function ea(a){var b=new Date;b.setTime(b.getTime()+5184E6);var b=b.toUTCString(),c=a.document,d;a.innerWidth?d=function(){return{w:a.innerWidth,h:a.innerHeight}}:c.documentElement&&c.documentElement.clientWidth?
d=function(){return{w:c.documentElement.clientWidth,h:c.documentElement.clientHeight}}:c.body&&(d=function(){return{w:c.body.clientWidth,h:c.body.clientHeight}});window.onFirebugResize=function(){W(d().h);clearInterval(a._firebugWin_resize);a._firebugWin_resize=setTimeout(function(){document.cookie="_firebugPosition\x3d"+[a.screenLeft,a.screenTop,a.outerWidth||a.document.body.offsetWidth,a.outerHeight||a.document.body.offsetHeight].join()+"; expires\x3d"+b+"; path\x3d/"},5E3)}}function fa(){if(!m){x(!0);
if(h.config.popup){var a="100%",b=document.cookie.match(/(?:^|; )_firebugPosition=([^;]*)/),b=b?b[1].split(","):[2,2,320,480];t=da(b[0],b[1],b[2],b[3]);l=t.document;h.config.debugContainerId="fb";t.console=window.console;t.dojo=window.dojo}else l=document,a=(h.config.debugHeight||300)+"px";var c=l.createElement("link");c.href=ca.toUrl("./firebug.css");c.rel="stylesheet";c.type="text/css";var d=l.getElementsByTagName("head");d&&(d=d[0]);d||(d=l.getElementsByTagName("html")[0]);q("ie")?window.setTimeout(function(){d.appendChild(c)},
0):d.appendChild(c);h.config.debugContainerId&&(m=l.getElementById(h.config.debugContainerId));m||(m=l.createElement("div"),l.body.appendChild(m));m.className+=" firebug";m.id="firebug";m.style.height=a;m.style.display=B?"block":"none";a=function(a,b,c,d){return'\x3cli class\x3d"'+d+'"\x3e\x3ca href\x3d"javascript:void(0);" onclick\x3d"console.'+c+'(); return false;" title\x3d"'+b+'"\x3e'+a+"\x3c/a\x3e\x3c/li\x3e"};m.innerHTML='\x3cdiv id\x3d"firebugToolbar"\x3e  \x3cul id\x3d"fireBugTabs" class\x3d"tabs"\x3e'+
a("Clear","Remove All Console Logs","clear","")+a("ReCSS","Refresh CSS without reloading page","recss","")+a("Console","Show Console Logs","openConsole","gap")+a("DOM","Show DOM Inspector","openDomInspector","")+a("Object","Show Object Inspector","openObjectInspector","")+(h.config.popup?"":a("Close","Close the console","close","gap"))+'\t\x3c/ul\x3e\x3c/div\x3e\x3cinput type\x3d"text" id\x3d"firebugCommandLine" /\x3e\x3cdiv id\x3d"firebugLog"\x3e\x3c/div\x3e\x3cdiv id\x3d"objectLog" style\x3d"display:none;"\x3eClick on an object in the Log display\x3c/div\x3e\x3cdiv id\x3d"domInspect" style\x3d"display:none;"\x3eHover over HTML elements in the main page. Click to hold selection.\x3c/div\x3e';
l.getElementById("firebugToolbar");k=l.getElementById("firebugCommandLine");O(k,"keydown",ga);O(l,q("ie")||q("safari")?"keydown":"keypress",P);f=l.getElementById("firebugLog");u=l.getElementById("objectLog");v=l.getElementById("domInspect");l.getElementById("fireBugTabs");W();ha()}}function ia(){l=null;t.console&&t.console.clear();k=v=u=f=m=t=null;G=[];r=[];C={}}function ja(){var a=k.value;k.value="";z(["\x3e  ",a],"command");try{eval(a)}catch(b){}}function W(a){a=a?a-(25+k.offsetHeight+25+0.01*a)+
"px":m.offsetHeight-25-k.offsetHeight+"px";f.style.top="25px";f.style.height=a;u.style.height=a;u.style.top="25px";v.style.height=a;v.style.top="25px";k.style.bottom=0;h.addOnWindowUnload(ia)}function z(a,b,c){f?X(a,b,c):G.push([a,b,c])}function ha(){var a=G;G=[];for(var b=0;b<a.length;++b)X(a[b][0],a[b][1],a[b][2])}function X(a,b,c){var d=f.scrollTop+f.offsetHeight>=f.scrollHeight;c=c||ka;c(a,b);d&&(f.scrollTop=f.scrollHeight-f.offsetHeight)}function ka(a,b){var c=f.ownerDocument.createElement("div");
c.className="logRow"+(b?" logRow-"+b:"");c.innerHTML=a.join("");(r.length?r[r.length-1]:f).appendChild(c)}function la(a,b){s(a,b);var c=f.ownerDocument.createElement("div");c.className="logGroupBox";(r.length?r[r.length-1]:f).appendChild(c);r.push(c)}function ma(){r.pop()}function s(a,b){var c=[],d=a[0],e=0;"string"!=typeof d&&(d="",e=-1);for(var y=na(d),d=0;d<y.length;++d){var f=y[d];f&&"object"==typeof f?f.appender(a[++e],c):w(f,c)}y=[];f=[];for(d=e+1;d<a.length;++d)if(w(" ",c),e=a[d],void 0===
e||null===e)Q(e,c);else if("string"==typeof e)w(e,c);else if(e instanceof Date)w(e.toString(),c);else if(9==e.nodeType)w("[ XmlDoc ]",c);else{var k="_a"+oa++;y.push(k);f.push(e);e='\x3ca id\x3d"'+k+'" href\x3d"javascript:void(0);"\x3e'+H(e)+"\x3c/a\x3e";c.push(e+"")}z(c,b);for(d=0;d<y.length;d++)if(c=l.getElementById(y[d]))c.obj=f[d],t.console._connects.push(h.connect(c,"onclick",function(){console.openObjectInspector();try{I(this.obj)}catch(a){this.obj=a}u.innerHTML="\x3cpre\x3e"+I(this.obj)+"\x3c/pre\x3e"}))}
function na(a){for(var b=[],c=/((^%|[^\\]%)(\d+)?(\.)([a-zA-Z]))|((^%|[^\\]%)([a-zA-Z]))/,d={s:w,d:R,i:R,f:pa},e=c.exec(a);e;e=c.exec(a)){var f=e[8]?e[8]:e[5],f=f in d?d[f]:qa,h=e[3]?parseInt(e[3]):"."==e[4]?-1:0;b.push(a.substr(0,"%"==e[0][0]?e.index:e.index+1));b.push({appender:f,precision:h});a=a.substr(e.index+e[0].length)}b.push(a);return b}function n(a){return String(a).replace(/[<>&"']/g,function(a){switch(a){case "\x3c":return"\x26lt;";case "\x3e":return"\x26gt;";case "\x26":return"\x26amp;";
case "'":return"\x26#39;";case '"':return"\x26quot;"}return"?"})}function w(a,b){b.push(n(a+""))}function Q(a,b){b.push('\x3cspan class\x3d"objectBox-null"\x3e',n(a+""),"\x3c/span\x3e")}function R(a,b){b.push('\x3cspan class\x3d"objectBox-number"\x3e',n(a+""),"\x3c/span\x3e")}function pa(a,b){b.push('\x3cspan class\x3d"objectBox-number"\x3e',n(a+""),"\x3c/span\x3e")}function qa(a,b){try{if(void 0===a)Q("undefined",b);else if(null===a)Q("null",b);else if("string"==typeof a)b.push('\x3cspan class\x3d"objectBox-string"\x3e\x26quot;',
n(a+""),"\x26quot;\x3c/span\x3e");else if("number"==typeof a)R(a,b);else if("function"==typeof a)b.push('\x3cspan class\x3d"objectBox-function"\x3e',H(a),"\x3c/span\x3e");else if(1==a.nodeType)b.push('\x3cspan class\x3d"objectBox-selector"\x3e'),b.push('\x3cspan class\x3d"selectorTag"\x3e',n(a.nodeName.toLowerCase()),"\x3c/span\x3e"),a.id&&b.push('\x3cspan class\x3d"selectorId"\x3e#',n(a.id),"\x3c/span\x3e"),a.className&&b.push('\x3cspan class\x3d"selectorClass"\x3e.',n(a.className),"\x3c/span\x3e"),
b.push("\x3c/span\x3e");else if("object"==typeof a){var c=a+"",d=/\[object (.*?)\]/.exec(c);b.push('\x3cspan class\x3d"objectBox-object"\x3e',d?d[1]:c,"\x3c/span\x3e")}else w(a,b)}catch(e){}}function J(a,b){if(1==a.nodeType){b.push('\x3cdiv class\x3d"objectBox-element"\x3e','\x26lt;\x3cspan class\x3d"nodeTag"\x3e',a.nodeName.toLowerCase(),"\x3c/span\x3e");for(var c=0;c<a.attributes.length;++c){var d=a.attributes[c];d.specified&&b.push('\x26nbsp;\x3cspan class\x3d"nodeName"\x3e',d.nodeName.toLowerCase(),
'\x3c/span\x3e\x3d\x26quot;\x3cspan class\x3d"nodeValue"\x3e',n(d.nodeValue),"\x3c/span\x3e\x26quot;")}if(a.firstChild){b.push('\x26gt;\x3c/div\x3e\x3cdiv class\x3d"nodeChildren"\x3e');for(c=a.firstChild;c;c=c.nextSibling)J(c,b);b.push('\x3c/div\x3e\x3cdiv class\x3d"objectBox-element"\x3e\x26lt;/\x3cspan class\x3d"nodeTag"\x3e',a.nodeName.toLowerCase(),"\x26gt;\x3c/span\x3e\x3c/div\x3e")}else b.push("/\x26gt;\x3c/div\x3e")}else 3==a.nodeType&&b.push('\x3cdiv class\x3d"nodeText"\x3e',n(a.nodeValue),
"\x3c/div\x3e")}function O(a,b,c){document.all?a.attachEvent("on"+b,c):a.addEventListener(b,c,!1)}function P(a){var b=(new Date).getTime();if(b>Y+200){a=h.fixEvent(a);var c=h.keys,d=a.keyCode;Y=b;if(d==c.F12)x();else if((d==c.NUMPAD_ENTER||76==d)&&a.shiftKey&&(a.metaKey||a.ctrlKey))x(!0),k&&k.focus();else return;document.all?a.cancelBubble=!0:a.stopPropagation()}}function ga(a){var b=h.keys;if(13==a.keyCode&&k.value){a=k.value;var b=(b=D("firebug_history"))?h.fromJson(b):[],c=h.indexOf(b,a);-1!=c&&
b.splice(c,1);b.push(a);for(D("firebug_history",h.toJson(b),30);b.length&&!D("firebug_history");)b.shift(),D("firebug_history",h.toJson(b),30);E=null;p=-1;ja()}else if(27==a.keyCode)k.value="";else if(a.keyCode==b.UP_ARROW||a.charCode==b.UP_ARROW)K("older");else if(a.keyCode==b.DOWN_ARROW||a.charCode==b.DOWN_ARROW)K("newer");else if(a.keyCode==b.HOME||a.charCode==b.HOME)p=1,K("older");else if(a.keyCode==b.END||a.charCode==b.END)p=999999,K("newer")}function K(a){var b=D("firebug_history"),b=b?h.fromJson(b):
[];b.length&&(null===E&&(E=k.value),-1==p&&(p=b.length),"older"==a?(--p,0>p&&(p=0)):"newer"==a&&(++p,p>b.length&&(p=b.length)),p==b.length?(k.value=E,E=null):k.value=b[p])}function D(a,b){var c=document.cookie;if(1==arguments.length)return(c=c.match(RegExp("(?:^|; )"+a+"\x3d([^;]*)")))?decodeURIComponent(c[1]):void 0;c=new Date;c.setMonth(c.getMonth()+1);document.cookie=a+"\x3d"+encodeURIComponent(b)+(c.toUtcString?"; expires\x3d"+c.toUTCString():"")}function Z(a){return a&&a instanceof Array||"array"==
typeof a}function I(a,b,c,d){c=c||"";b=b||" \t";d=d||[];var e;if(a&&1==a.nodeType)return b=[],J(a,b),b.join("");var f=",\n",h=0,k;k=0;for(e in a)k++;if(a instanceof Date)return b+a.toString()+f;var g;a:for(g in a)if(h++,h==k&&(f="\n"),!(a[g]===window||a[g]===document))if(null===a[g])c+=b+g+" : NULL"+f;else if(a[g]&&a[g].nodeType)1!=a[g].nodeType&&3==a[g].nodeType&&(c+=b+g+" : [ TextNode "+a[g].data+" ]"+f);else if("object"==typeof a[g]&&(a[g]instanceof String||a[g]instanceof Number||a[g]instanceof
Boolean))c+=b+g+" : "+a[g]+","+f;else if(a[g]instanceof Date)c+=b+g+" : "+a[g].toString()+f;else if("object"==typeof a[g]&&a[g]){e=0;for(var l;l=d[e];e++)if(a[g]===l){c+=b+g+" : RECURSION"+f;continue a}d.push(a[g]);e=Z(a[g])?["[","]"]:["{","}"];c+=b+g+" : "+e[0]+"\n";c+=I(a[g],b+" \t","",d);c+=b+e[1]+f}else"undefined"==typeof a[g]?c+=b+g+" : undefined"+f:"toString"==g&&"function"==typeof a[g]?(e=a[g](),"string"==typeof e&&e.match(/function ?(.*?)\(/)&&(e=n(H(a[g]))),c+=b+g+" : "+e+f):c+=b+g+" : "+
n(H(a[g]))+f;return c}function H(a){var b=a instanceof Error;if(1==a.nodeType)return n("\x3c "+a.tagName.toLowerCase()+' id\x3d"'+a.id+'" /\x3e');if(3==a.nodeType)return n('[TextNode: "'+a.nodeValue+'"]');var c=a&&(a.id||a.name||a.ObjectID||a.widgetId);if(!b&&c)return"{"+c+"}";var d=0;if(b)c="[ Error: "+(a.message||a.description||a)+" ]";else if(Z(a))c="["+a.slice(0,4).join(","),4<a.length&&(c+=" ... ("+a.length+" items)"),c+="]";else if("function"==typeof a)(a=/function\s*([^\(]*)(\([^\)]*\))[^\{]*\{/.exec(a+
""))?(a[1]||(a[1]="function"),c=a[1]+a[2]):c="function()";else if("object"!=typeof a||"string"==typeof a)c=a+"";else{var c="{",e;for(e in a){d++;if(2<d)break;c+=e+":"+n(a[e])+"  "}c+="}"}return c}if(V=/Trident/.test(window.navigator.userAgent)){for(var S=["log","info","debug","warn","error"],L=0;L<S.length;L++){var M=S[L];if(console[M]&&!console[M]._fake){var $="_"+S[L];console[$]=console[M];console[M]=function(){var a=$;return function(){console[a](Array.prototype.join.call(arguments," "))}}()}}try{console.clear()}catch(ra){}}if(!q("ff")&&
!q("chrome")&&!q("safari")&&!V&&!window.firebug&&!("undefined"!=typeof console&&console.firebug||h.config.useCustomLogger||q("air"))){try{if(window!=window.parent){window.parent.console&&(window.console=window.parent.console);return}}catch(sa){}var l=document,t=window,oa=0,m=null,f=null,u=null,k=null,B=!1,G=[],r=[],C={},N={},v=null,aa,T,F=!1,U=null;document.createElement("div");var A,ba;window.console={_connects:[],log:function(){s(arguments,"")},debug:function(){s(arguments,"debug")},info:function(){s(arguments,
"info")},warn:function(){s(arguments,"warning")},error:function(){s(arguments,"error")},assert:function(a,b){if(!a){for(var c=[],d=1;d<arguments.length;++d)c.push(arguments[d]);s(c.length?c:["Assertion Failure"],"error");throw b?b:"Assertion Failure";}},dir:function(a){a=I(a);a=a.replace(/\n/g,"\x3cbr /\x3e");a=a.replace(/\t/g,"\x26nbsp;\x26nbsp;\x26nbsp;\x26nbsp;");z([a],"dir")},dirxml:function(a){var b=[];J(a,b);z(b,"dirxml")},group:function(){z(arguments,"group",la)},groupEnd:function(){z(arguments,
"",ma)},time:function(a){C[a]=(new Date).getTime()},timeEnd:function(a){if(a in C){var b=(new Date).getTime()-C[a];s([a+":",b+"ms"]);delete C[a]}},count:function(a){N[a]||(N[a]=0);N[a]++;s([a+": "+N[a]])},trace:function(a){a=a||3;for(var b=console.trace.caller,c=0;c<a;c++){for(var d=[],e=0;e<b.arguments.length;e++)d.push(b.arguments[e]);b=b.caller}},profile:function(){this.warn(["profile() not supported."])},profileEnd:function(){},clear:function(){if(f)for(;f.childNodes.length;)h.destroy(f.firstChild);
h.forEach(this._connects,h.disconnect)},open:function(){x(!0)},close:function(){B&&x()},_restoreBorder:function(){A&&(A.style.border=ba)},openDomInspector:function(){F=!0;f.style.display="none";v.style.display="block";u.style.display="none";document.body.style.cursor="pointer";aa=h.connect(document,"mousemove",function(a){if(F&&!U&&(U=setTimeout(function(){U=null},50),(a=a.target)&&A!==a)){console._restoreBorder();var b=[];J(a,b);v.innerHTML=b.join("");A=a;ba=A.style.border;A.style.border="#0000FF 1px solid"}});
setTimeout(function(){T=h.connect(document,"click",function(a){document.body.style.cursor="";F=!F;h.disconnect(T)})},30)},_closeDomInspector:function(){document.body.style.cursor="";h.disconnect(aa);h.disconnect(T);F=!1;console._restoreBorder()},openConsole:function(){f.style.display="block";v.style.display="none";u.style.display="none";console._closeDomInspector()},openObjectInspector:function(){f.style.display="none";v.style.display="none";u.style.display="block";console._closeDomInspector()},recss:function(){var a,
b,c;b=document.getElementsByTagName("link");for(a=0;a<b.length;a++)if(c=b[a],0<=c.rel.toLowerCase().indexOf("stylesheet")&&c.href){var d=c.href.replace(/(&|%5C?)forceReload=\d+/,"");c.href=d+(0<=d.indexOf("?")?"\x26":"?")+"forceReload\x3d"+(new Date).valueOf()}}};h.addOnLoad(fa);var Y=(new Date).getTime(),p=-1,E=null;O(document,q("ie")||q("safari")?"keydown":"keypress",P);("true"==document.documentElement.getAttribute("debug")||h.config.isDebug)&&x(!0);h.addOnWindowUnload(function(){var a=document,
b=q("ie")||q("safari")?"keydown":"keypress",c=P;document.all?a.detachEvent("on"+b,c):a.removeEventListener(b,c,!1);window.onFirebugResize=null;window.console=null})}});
//# sourceMappingURL=firebug.js.map