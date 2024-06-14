/**
 * Creates a deep observer for an object using Proxy.
 *
 * @param {object} obj - The object to observe.
 * @param {function} callback - The callback function to be called when a property is set or deleted.
 * @returns {object} - The proxied object with deep observation capabilities.
 */
function createDeepObserver(obj, callback) {
    return new Proxy(obj, {
        get(target, property, receiver) {
            const result = Reflect.get(target, property, receiver);
            // Recursively wrap nested objects in a Proxy
            if (isObject(result)) {
                return createDeepObserver(result, callback);
            }
            return result;
        },
        set(target, property, value, receiver) {
          const oldValue = target[property];
          const result = Reflect.set(target, property, value, receiver);
          if (oldValue !== value) {
              callback({ type: 'set', target, property, oldValue, value });
          }
          return result;
        },
        deleteProperty(target, property) {
            const oldValue = target[property];
            const result = Reflect.deleteProperty(target, property);
            callback({ type: 'delete', target, property, oldValue });
            return result;
        }
    });
}

function isObject(val) {
    return val !== null && typeof val === 'object' && !(val instanceof Node);
}

export { createDeepObserver };