//>>built
define("dojox/wire/TextAdapter",["dijit","dojo","dojox","dojo/require!dojox/wire/CompositeWire"],function(e,c,d){c.provide("dojox.wire.TextAdapter");c.require("dojox.wire.CompositeWire");c.declare("dojox.wire.TextAdapter",d.wire.CompositeWire,{_wireClass:"dojox.wire.TextAdapter",constructor:function(a){this._initializeChildren(this.segments);this.delimiter||(this.delimiter="")},_getValue:function(a){if(!a||!this.segments)return a;var b="",c;for(c in this.segments)var d=this.segments[c].getValue(a),
b=this._addSegment(b,d);return b},_setValue:function(a,b){throw Error("Unsupported API: "+this._wireClass+"._setValue");},_addSegment:function(a,b){return b?a?a+this.delimiter+b:b:a}})});
//# sourceMappingURL=TextAdapter.js.map