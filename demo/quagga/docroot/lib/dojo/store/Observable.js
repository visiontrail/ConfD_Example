/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

//>>built
define("dojo/store/Observable",["../_base/kernel","../_base/lang","../when","../_base/array"],function(a,n,p,t){a=function(b){function a(q,f){var c=b[q];c&&(b[q]=function(d){var g;"put"===q&&(g=b.getIdentity(d));if(r)return c.apply(this,arguments);r=!0;try{var a=c.apply(this,arguments);p(a,function(b){f("object"==typeof b&&b||d,g)});return a}finally{r=!1}})}var l=[],u=0;b=n.delegate(b);b.notify=function(b,f){u++;for(var c=l.slice(),a=0,g=c.length;a<g;a++)c[a](b,f)};var w=b.query;b.query=function(a,
f){f=f||{};var c=w.apply(this,arguments);if(c&&c.forEach){var d=n.mixin({},f);delete d.start;delete d.count;var g=b.queryEngine&&b.queryEngine(a,d),r=u,s=[],v;c.observe=function(a,q){1==s.push(a)&&l.push(v=function(a,d){p(c,function(e){var c=e.length!=f.count,h,l;if(++r!=u)throw Error("Query is out of date, you must observe() the query prior to any data modifications");var n,m=-1,k=-1;if(void 0!==d){h=0;for(l=e.length;h<l;h++){var p=e[h];if(b.getIdentity(p)==d){n=p;m=h;(g||!a)&&e.splice(h,1);break}}}if(g){if(a&&
(g.matches?g.matches(a):g([a]).length))h=-1<m?m:e.length,e.splice(h,0,a),k=t.indexOf(g(e),a),e.splice(h,1),f.start&&0==k||!c&&k==e.length?k=-1:e.splice(k,0,a)}else a&&(void 0!==d?k=m:f.start||(k=b.defaultIndex||0,e.splice(k,0,a)));if((-1<m||-1<k)&&(q||!g||m!=k)){c=s.slice();for(h=0;e=c[h];h++)e(a||n,m,k)}})});var d={};d.remove=d.cancel=function(){var b=t.indexOf(s,a);-1<b&&(s.splice(b,1),s.length||l.splice(t.indexOf(l,v),1))};return d}}return c};var r;a("put",function(a,f){b.notify(a,f)});a("add",
function(a){b.notify(a)});a("remove",function(a){b.notify(void 0,a)});return b};n.setObject("dojo.store.Observable",a);return a});
//# sourceMappingURL=Observable.js.map