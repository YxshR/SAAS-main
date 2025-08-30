// Polyfills for cross-browser compatibility

// Intersection Observer polyfill
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  import('intersection-observer').then(() => {
    console.log('IntersectionObserver polyfill loaded');
  });
}

// ResizeObserver polyfill
if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  import('@juggle/resize-observer').then(({ ResizeObserver }) => {
    (window as any).ResizeObserver = ResizeObserver;
    console.log('ResizeObserver polyfill loaded');
  });
}

// Web Animations API polyfill
if (typeof window !== 'undefined' && !('animate' in document.createElement('div'))) {
  import('web-animations-js').then(() => {
    console.log('Web Animations API polyfill loaded');
  });
}

// CSS Custom Properties polyfill for IE11
if (typeof window !== 'undefined' && !CSS.supports('color', 'var(--fake-var)')) {
  import('css-vars-ponyfill').then(({ default: cssVars }) => {
    cssVars({
      include: 'style,link[rel="stylesheet"]',
      onlyLegacy: true,
      watch: true
    });
    console.log('CSS Custom Properties polyfill loaded');
  });
}

// Fetch polyfill
if (typeof window !== 'undefined' && !('fetch' in window)) {
  import('whatwg-fetch').then(() => {
    console.log('Fetch polyfill loaded');
  });
}

// Object.assign polyfill
if (!Object.assign) {
  Object.assign = function(target: any, ...sources: any[]) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    const to = Object(target);

    for (let index = 0; index < sources.length; index++) {
      const nextSource = sources[index];

      if (nextSource != null) {
        for (const nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

// Array.from polyfill
if (!Array.from) {
  Array.from = function(arrayLike: any, mapFn?: any, thisArg?: any) {
    const C = this;
    const items = Object(arrayLike);
    if (arrayLike == null) {
      throw new TypeError('Array.from requires an array-like object - not null or undefined');
    }
    const mapFunction = mapFn === undefined ? undefined : mapFn;
    if (typeof mapFunction !== 'undefined' && typeof mapFunction !== 'function') {
      throw new TypeError('Array.from: when provided, the second argument must be a function');
    }
    const len = parseInt(items.length) || 0;
    const A = typeof C === 'function' ? Object(new C(len)) : new Array(len);
    let k = 0;
    let kValue;
    while (k < len) {
      kValue = items[k];
      if (mapFunction) {
        A[k] = typeof thisArg === 'undefined' ? mapFunction(kValue, k) : mapFunction.call(thisArg, kValue, k);
      } else {
        A[k] = kValue;
      }
      k += 1;
    }
    A.length = len;
    return A;
  };
}

// Promise polyfill
if (typeof window !== 'undefined' && !window.Promise) {
  import('es6-promise/auto').then(() => {
    console.log('Promise polyfill loaded');
  });
}

export {};