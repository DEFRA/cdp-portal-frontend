(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["macro.njk"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var macro_t_1 = runtime.makeMacro(
["params"], 
[], 
function (l_params, kwargs) {
var callerFrame = frame;
frame = new runtime.Frame();
kwargs = kwargs || {};
if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {
frame.set("caller", kwargs.caller); }
frame.set("params", l_params);
var t_2 = "";var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("./template.njk", false, "macro.njk", false, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
callback(null,t_5);});
});
tasks.push(
function(result, callback){
t_2 += result;
callback(null);
});
env.waterfall(tasks, function(){
});
frame = callerFrame;
return new runtime.SafeString(t_2);
});
context.addExport("appTag");
context.setVariable("appTag", macro_t_1);
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();

