(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["339fcaa1-16d8-43a2-aade-eb31eaf929e3"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<div class=\"app-progress\">\n  <div class=\"app-progress__bar\">\n    <span class=\"app-progress__indicator\" style=\"width: ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"progress"), env.opts.autoescape);
output += "%;\"></span>\n  </div>\n  <div class=\"app-progress__readout\">\n    ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"complete"), env.opts.autoescape);
output += " / ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "params")),"total"), env.opts.autoescape);
output += "\n  </div>\n</div>\n";
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

  export default '339fcaa1-16d8-43a2-aade-eb31eaf929e3';
