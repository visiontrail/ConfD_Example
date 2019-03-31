/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

//>>built
define("dojo/_base/html","./kernel ../dom ../dom-style ../dom-attr ../dom-prop ../dom-class ../dom-construct ../dom-geometry".split(" "),function(a,l,e,d,m,g,h,b){a.byId=l.byId;a.isDescendant=l.isDescendant;a.setSelectable=l.setSelectable;a.getAttr=d.get;a.setAttr=d.set;a.hasAttr=d.has;a.removeAttr=d.remove;a.getNodeProp=d.getNodeProp;a.attr=function(a,b,c){return 2==arguments.length?d["string"==typeof b?"get":"set"](a,b):d.set(a,b,c)};a.hasClass=g.contains;a.addClass=g.add;a.removeClass=g.remove;
a.toggleClass=g.toggle;a.replaceClass=g.replace;a._toDom=a.toDom=h.toDom;a.place=h.place;a.create=h.create;a.empty=function(a){h.empty(a)};a._destroyElement=a.destroy=function(a){h.destroy(a)};a._getPadExtents=a.getPadExtents=b.getPadExtents;a._getBorderExtents=a.getBorderExtents=b.getBorderExtents;a._getPadBorderExtents=a.getPadBorderExtents=b.getPadBorderExtents;a._getMarginExtents=a.getMarginExtents=b.getMarginExtents;a._getMarginSize=a.getMarginSize=b.getMarginSize;a._getMarginBox=a.getMarginBox=
b.getMarginBox;a.setMarginBox=b.setMarginBox;a._getContentBox=a.getContentBox=b.getContentBox;a.setContentSize=b.setContentSize;a._isBodyLtr=a.isBodyLtr=b.isBodyLtr;a._docScroll=a.docScroll=b.docScroll;a._getIeDocumentElementOffset=a.getIeDocumentElementOffset=b.getIeDocumentElementOffset;a._fixIeBiDiScrollLeft=a.fixIeBiDiScrollLeft=b.fixIeBiDiScrollLeft;a.position=b.position;a.marginBox=function(a,f){return f?b.setMarginBox(a,f):b.getMarginBox(a)};a.contentBox=function(a,f){return f?b.setContentSize(a,
f):b.getContentBox(a)};a.coords=function(k,f){a.deprecated("dojo.coords()","Use dojo.position() or dojo.marginBox().");k=l.byId(k);var c=e.getComputedStyle(k),c=b.getMarginBox(k,c),d=b.position(k,f);c.x=d.x;c.y=d.y;return c};a.getProp=m.get;a.setProp=m.set;a.prop=function(a,b,c){return 2==arguments.length?m["string"==typeof b?"get":"set"](a,b):m.set(a,b,c)};a.getStyle=e.get;a.setStyle=e.set;a.getComputedStyle=e.getComputedStyle;a.__toPixelValue=a.toPixelValue=e.toPixelValue;a.style=function(a,b,c){switch(arguments.length){case 1:return e.get(a);
case 2:return e["string"==typeof b?"get":"set"](a,b)}return e.set(a,b,c)};return a});
//# sourceMappingURL=html.js.map