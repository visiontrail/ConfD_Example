//>>built
define("dojox/storage/AirFileStorageProvider",["dijit","dojo","dojox","dojo/require!dojox/storage/manager,dojox/storage/Provider"],function(l,g,f){g.provide("dojox.storage.AirFileStorageProvider");g.require("dojox.storage.manager");g.require("dojox.storage.Provider");g.isAIR&&function(){if(!e)var e={};e.File=window.runtime.flash.filesystem.File;e.FileStream=window.runtime.flash.filesystem.FileStream;e.FileMode=window.runtime.flash.filesystem.FileMode;g.declare("dojox.storage.AirFileStorageProvider",
[f.storage.Provider],{initialized:!1,_storagePath:"__DOJO_STORAGE/",initialize:function(){this.initialized=!1;try{var a=e.File.applicationStorageDirectory.resolvePath(this._storagePath);a.exists||a.createDirectory();this.initialized=!0}catch(c){}f.storage.manager.loaded()},isAvailable:function(){return!0},put:function(a,c,b,d){if(!1==this.isValidKey(a))throw Error("Invalid key given: "+a);d=d||this.DEFAULT_NAMESPACE;if(!1==this.isValidKey(d))throw Error("Invalid namespace given: "+d);try{this.remove(a,
d);var h=e.File.applicationStorageDirectory.resolvePath(this._storagePath+d);h.exists||h.createDirectory();var g=h.resolvePath(a),f=new e.FileStream;f.open(g,e.FileMode.WRITE);f.writeObject(c);f.close()}catch(k){b(this.FAILED,a,k.toString(),d);return}b&&b(this.SUCCESS,a,null,d)},get:function(a,c){if(!1==this.isValidKey(a))throw Error("Invalid key given: "+a);c=c||this.DEFAULT_NAMESPACE;var b=null,d=e.File.applicationStorageDirectory.resolvePath(this._storagePath+c+"/"+a);if(d.exists&&!d.isDirectory){var h=
new e.FileStream;h.open(d,e.FileMode.READ);b=h.readObject();h.close()}return b},getNamespaces:function(){var a=[this.DEFAULT_NAMESPACE],c=e.File.applicationStorageDirectory.resolvePath(this._storagePath).getDirectoryListing(),b;for(b=0;b<c.length;b++)c[b].isDirectory&&c[b].name!=this.DEFAULT_NAMESPACE&&a.push(c[b].name);return a},getKeys:function(a){a=a||this.DEFAULT_NAMESPACE;if(!1==this.isValidKey(a))throw Error("Invalid namespace given: "+a);var c=[];a=e.File.applicationStorageDirectory.resolvePath(this._storagePath+
a);if(a.exists&&a.isDirectory){a=a.getDirectoryListing();var b;for(b=0;b<a.length;b++)c.push(a[b].name)}return c},clear:function(a){if(!1==this.isValidKey(a))throw Error("Invalid namespace given: "+a);a=e.File.applicationStorageDirectory.resolvePath(this._storagePath+a);a.exists&&a.isDirectory&&a.deleteDirectory(!0)},remove:function(a,c){c=c||this.DEFAULT_NAMESPACE;var b=e.File.applicationStorageDirectory.resolvePath(this._storagePath+c+"/"+a);b.exists&&!b.isDirectory&&b.deleteFile()},putMultiple:function(a,
c,b,d){if(!1===this.isValidKeyArray(a)||!c instanceof Array||a.length!=c.length)throw Error("Invalid arguments: keys \x3d ["+a+"], values \x3d ["+c+"]");if(null==d||"undefined"==typeof d)d=this.DEFAULT_NAMESPACE;if(!1==this.isValidKey(d))throw Error("Invalid namespace given: "+d);this._statusHandler=b;try{for(var e=0;e<a.length;e++)this.put(a[e],c[e],null,d)}catch(f){b&&b(this.FAILED,a,f.toString(),d);return}b&&b(this.SUCCESS,a,null,d)},getMultiple:function(a,c){if(!1===this.isValidKeyArray(a))throw Error("Invalid key array given: "+
a);if(null==c||"undefined"==typeof c)c=this.DEFAULT_NAMESPACE;if(!1==this.isValidKey(c))throw Error("Invalid namespace given: "+c);for(var b=[],d=0;d<a.length;d++)b[d]=this.get(a[d],c);return b},removeMultiple:function(a,c){c=c||this.DEFAULT_NAMESPACE;for(var b=0;b<a.length;b++)this.remove(a[b],c)},isPermanent:function(){return!0},getMaximumSize:function(){return this.SIZE_NO_LIMIT},hasSettingsUI:function(){return!1},showSettingsUI:function(){throw Error(this.declaredClass+" does not support a storage settings user-interface");
},hideSettingsUI:function(){throw Error(this.declaredClass+" does not support a storage settings user-interface");}});f.storage.manager.register("dojox.storage.AirFileStorageProvider",new f.storage.AirFileStorageProvider);f.storage.manager.initialize()}()});
//# sourceMappingURL=AirFileStorageProvider.js.map