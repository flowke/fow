let Hooks = function () {
  this.listeners = {};
};

Hooks.prototype.listeners = null;
Hooks.prototype.addEventListener = function (type, callback) {
  if (!(type in this.listeners)) {
    this.listeners[type] = [];
  }
  this.listeners[type].push(callback);
};
Hooks.prototype.add = Hooks.prototype.addEventListener

Hooks.prototype.removeEventListener = function (type, callback) {
  if (!(type in this.listeners)) {
    return;
  }

  if(!callback){
    this.listeners[type] = undefined;
    return
  }

  var stack = this.listeners[type];

  for (var i = 0, l = stack.length; i < l; i++) {
    if (stack[i] === callback) {
      stack.splice(i, 1);
      return this.removeEventListener(type, callback);
    }
  }
};
Hooks.prototype.remove = Hooks.prototype.removeEventListener

Hooks.prototype.dispatchEvent = function (type, event) {
  if (!(type in this.listeners)) {
    return;
  }
  var stack = this.listeners[type];

  for (var i = 0, l = stack.length; i < l; i++) {
    stack[i].call(this, event);
  }
};
Hooks.prototype.dispatch = Hooks.prototype.dispatchEvent

export default Hooks