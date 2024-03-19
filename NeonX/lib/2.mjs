function defaultOptimization(changes) {
  const changesWithDomElements = changes.filter(
    (change) => Object.keys(change).every(
      (selector) => document.querySelector(domSelector(selector)) !== null
    )
  );
  return changesWithDomElements;
}
function executeTemplateChange(change) {
  const optimizedChange = optimizeChangeRequest(change);
  return executeTemplateChangeCycle(optimizedChange);
}
function executeTemplateChangeCycle(changes) {
  for (const change of changes) {
    for (const [selector, template] of Object.entries(change)) {
      const elements = templateElements(selector);
      elements == null ? void 0 : elements.forEach((element) => {
        element.innerHTML = template;
      });
    }
  }
  return true;
}
function optimizeChangeRequest(change, optimization = defaultOptimization) {
  const changeCycles = Array.isArray(change) ? change : [change];
  return optimization(changeCycles);
}
function domSelector(selector) {
  const isDomSelector = selector.startsWith("#") || selector.startsWith(".") || selector.startsWith("[");
  return isDomSelector ? selector : `[\\@${selector}]`;
}
function templateElements(selector) {
  const twoJsSelector = domSelector(selector);
  return document.querySelectorAll(twoJsSelector) ?? [];
}
function isTypeOperatorFunction(value) {
  return typeof value === "function";
}
function isBrowser() {
  return typeof document !== "undefined";
}
function identityFunction(x) {
  return x;
}
class Component {
  constructor(data) {
    const operatorFunctions = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        operatorFunctions[key] = isTypeOperatorFunction(data[key]) ? data[key] : identityFunction;
      }
    }
    const proxy = new Proxy(this, {
      get(target, prop) {
        const operatorFunction = operatorFunctions[prop];
        if (target[prop] === void 0) {
          return operatorFunction;
        }
        return operatorFunction(target[prop]);
      },
      //@ts-ignore
      set(target, prop, value) {
        if (!(prop in operatorFunctions)) {
          operatorFunctions[prop] = isTypeOperatorFunction(value) ? value : identityFunction;
        }
        const operatorFunction = operatorFunctions[prop];
        if (isTypeOperatorFunction(value)) {
          operatorFunctions[prop] = value;
          return true;
        }
        const privateValue = operatorFunction(value);
        target[prop] = privateValue;
        const domValue = (privateValue == null ? void 0 : privateValue.toString) ? privateValue.toString() : privateValue;
        if (isBrowser()) {
          const key = prop.toString();
          const changeRequest = { [key]: domValue };
          executeTemplateChange(changeRequest);
        }
        return true;
      }
    });
    Object.assign(proxy, data);
    return proxy;
  }
}
module.exports = Component;
