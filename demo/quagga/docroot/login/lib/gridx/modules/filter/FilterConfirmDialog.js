//>>built
require({cache:{"url:gridx/templates/FilterConfirmDialog.html":'\x3cdiv class\x3d"gridxFilterConfirmDialogMessage"\x3e${clearFilterMsg}\x3c/div\n\x3e\x3cdiv class\x3d"gridxFilterConfirmDialogButtons"\n\t\x3e\x3cinput type\x3d"button" data-dojo-type\x3d"dijit.form.Button" label\x3d"${clearButton}"\n\t/\x3e\x3cinput type\x3d"button" data-dojo-type\x3d"dijit.form.Button" label\x3d"${cancelButton}"\n/\x3e\x3c/div\x3e\n'}});
define("gridx/modules/filter/FilterConfirmDialog",["dojo/_base/declare","dojo/string","dijit/Dialog","dojo/text!../../templates/FilterConfirmDialog.html"],function(b,c,d,e){return b(d,{grid:null,cssClass:"gridxFilterConfirmDialog",autofocus:!1,postCreate:function(){this.inherited(arguments);this.set("title",this.grid.nls.clearFilterDialogTitle);this.set("content",c.substitute(e,this.grid.nls));var a=dijit.findWidgets(this.domNode);this.btnClear=a[0];this.btnCancel=a[1];this.connect(this.btnCancel,
"onClick","hide");this.connect(this.btnClear,"onClick","onExecute");this.connect(this,"show",function(){this.btnCancel.focus()})},onExecute:function(){this.execute()},execute:function(){}})});
//# sourceMappingURL=FilterConfirmDialog.js.map