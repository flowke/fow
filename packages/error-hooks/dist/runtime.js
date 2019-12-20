var uncatchs = window._errorUncatchEvents;

if (!uncatchs && !window._errorHooks) {
  uncatchs = window._errorUncatchEvents = [];
  var oldPush = uncatchs.push.bind(uncatchs);

  uncatchs.push = function (ev) {
    oldPush(ev);
  };

  window.addEventListener('error', uncatchs.push, true);
  window.addEventListener('unhandledrejection', uncatchs.push);
}