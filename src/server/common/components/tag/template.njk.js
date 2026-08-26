(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["template.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("loader/macro.njk", false, "template.njk", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
t_1.getExported(function(t_3,t_1) {
if(t_3) { cb(t_3); return; }
if(Object.prototype.hasOwnProperty.call(t_1, "appLoader")) {
var t_4 = t_1.appLoader;
} else {
cb(new Error("cannot import 'appLoader'")); return;
}
context.setVariable("appLoader", t_4);
output += "\n";
env.getTemplate("govuk/components/tag/macro.njk", false, "template.njk", false, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
t_5.getExported(function(t_7,t_5) {
if(t_7) { cb(t_7); return; }
if(Object.prototype.hasOwnProperty.call(t_5, "govukTag")) {
var t_8 = t_5.govukTag;
} else {
cb(new Error("cannot import 'govukTag'")); return;
}
context.setVariable("govukTag", t_8);
output += "\n\n";
var t_9;
t_9 = (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")?env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"html")):runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"text"));
frame.set("content", t_9, true);
if(frame.topLevel) {
context.setVariable("content", t_9);
}
if(frame.topLevel) {
context.addExport("content", t_9);
}
output += "\n\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"url")) {
output += "\n  <a class=\"app-link govuk-link";
if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"link")),"classes")) {
output += " ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"link")),"classes"), env.opts.autoescape);
;
}
output += "\"\n     href=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"url"), env.opts.autoescape);
output += "\"";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"newWindow")) {
output += " target=\"_blank\" rel=\"noopener noreferrer\"";
;
}
output += "\n     data-testid=\"app-entity-link\">\n";
;
}
output += "\n\n";
var t_10;
t_10 = env.getFilter("trim").call(context, env.getFilter("join").call(context, ["app-tag",(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"classes"):""),(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"isLoading")?"app-tag--with-loader":"")]," "));
frame.set("classes", t_10, true);
if(frame.topLevel) {
context.setVariable("classes", t_10);
}
if(frame.topLevel) {
context.addExport("classes", t_10);
}
output += "\n\n";
var t_11;
t_11 = env.getFilter("trim").call(context, env.getFilter("join").call(context, ["govuk-!-margin-left-1","app-loader--small",(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"loaderClasses")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"loaderClasses"):""),(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"isLoading")?"app-loader--is-loading":"")]," "));
frame.set("loaderClasses", t_11, true);
if(frame.topLevel) {
context.setVariable("loaderClasses", t_11);
}
if(frame.topLevel) {
context.addExport("loaderClasses", t_11);
}
output += "\n\n";
var t_12;
t_12 = (function() {
var output = "";
output += "\n  ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "content"), env.opts.autoescape);
output += "\n  ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"isLoading")) {
output += runtime.suppressValue((lineno = 25, colno = 16, runtime.callWrap(t_4, "appLoader", context, [{"classes": runtime.contextOrFrameLookup(context, frame, "loaderClasses")}])), env.opts.autoescape);
;
}
output += "\n";
;
return output;
})()
;
frame.set("contentHtml", t_12, true);
if(frame.topLevel) {
context.setVariable("contentHtml", t_12);
}
if(frame.topLevel) {
context.addExport("contentHtml", t_12);
}
output += "\n\n";
output += runtime.suppressValue((lineno = 31, colno = 11, runtime.callWrap(t_8, "govukTag", context, [{"html": runtime.contextOrFrameLookup(context, frame, "contentHtml"),"classes": runtime.contextOrFrameLookup(context, frame, "classes"),"attributes": (runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes")?runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"attributes"):"")}])), env.opts.autoescape);
output += "\n\n";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"url")) {
output += "\n  </a>\n";
;
}
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();

