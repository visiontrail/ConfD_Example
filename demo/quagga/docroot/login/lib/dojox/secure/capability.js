//>>built
define("dojox/secure/capability",["dijit","dojo","dojox"],function(r,l,b){l.provide("dojox.secure.capability");b.secure.badProps=/^__|^(apply|call|callee|caller|constructor|eval|prototype|this|unwatch|valueOf|watch)$|__$/;b.secure.capability={keywords:"break case catch const continue debugger default delete do else enum false finally for function if in instanceof new null yield return switch throw true try typeof var void while".split(" "),validate:function(a,g,b){function l(a,m){var c={};a.replace(/#\d+/g,
function(a){a=h[a.substring(1)];for(var e in a){if(e==n)throw e;"this"==e&&(a[":method"]&&1==a["this"])&&(e=n);":method"!=e&&(c[e]=2)}});a.replace(/(\W|^)([a-z_\$A-Z][\w_\$]*)/g,function(a,e,f){if("_"==f.charAt(0))throw Error("Names may not start with _");c[f]=1});return c}function p(a,m,c,d,e,b){function g(a,b,c,f){f.replace(/,?([a-z\$A-Z][_\w\$]*)/g,function(a,b){if("Class"==b)throw Error("Class is reserved");delete k[b]})}b.replace(/(^|,)0:\s*function#(\d+)/g,function(a,b,f){h[f][":method"]=1});
b=b.replace(/(^|[^_\w\$])Class\s*\(\s*([_\w\$]+\s*,\s*)*#(\d+)/g,function(a,b,f,c){delete h[c][n];return(b||"")+(f||"")+"#"+c});k=l(b,m);m&&g(a,c,c,e);b.replace(/(\W|^)(var) ([ \t,_\w\$]+)/g,g);return(c||"")+(d||"")+"#"+(h.push(k)-1)}for(var q=this.keywords,d=0;d<q.length;d++)b[q[d]]=!0;var n="|this| keyword in object literal without a Class call",h=[];if(a.match(/[\u200c-\u200f\u202a-\u202e\u206a-\u206f\uff00-\uffff]/))throw Error("Illegal unicode characters detected");if(a.match(/\/\*@cc_on/))throw Error("Conditional compilation token is not allowed");
a=a.replace(/\\["'\\\/bfnrtu]/g,"@").replace(/\/\/.*|\/\*[\w\W]*?\*\/|("[^"]*")|('[^']*')/g,function(a){return a.match(/^\/\/|^\/\*/)?" ":"0"}).replace(/\.\s*([a-z\$_A-Z][\w\$_]*)|([;,{])\s*([a-z\$_A-Z][\w\$_]*\s*):/g,function(a,b,c,d){b=b||d;if(/^__|^(apply|call|callee|caller|constructor|eval|prototype|this|unwatch|valueOf|watch)$|__$/.test(b))throw Error("Illegal property name "+b);return c&&c+"0:"||"~"});a.replace(/([^\[][\]\}]\s*=)|((\Wreturn|\S)\s*\[\s*\+?)|([^=!][=!]=[^=])/g,function(a){if(!a.match(/((\Wreturn|[=\&\|\:\?\,])\s*\[)|\[\s*\+$/))throw Error("Illegal operator "+
a.substring(1));});a=a.replace(RegExp("("+g.join("|")+")[\\s~]*\\(","g"),function(a){return"new("});var k;do g=a.replace(/((function|catch)(\s+[_\w\$]+)?\s*\(([^\)]*)\)\s*)?{([^{}]*)}/g,p);while(g!=a&&(a=g));p(0,0,0,0,0,a);for(d in k)if(!(d in b))throw Error("Illegal reference to "+d);}}});
//# sourceMappingURL=capability.js.map