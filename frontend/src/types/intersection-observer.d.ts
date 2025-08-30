declare module 'intersection-observer' {
  // This module provides a polyfill for IntersectionObserver
  // It doesn't export anything, just adds the global IntersectionObserver
}

declare module 'web-animations-js' {
  // This module provides a polyfill for Web Animations API
  // It doesn't export anything, just adds the animate method to elements
}

declare module 'whatwg-fetch' {
  // This module provides a polyfill for fetch API
  // It doesn't export anything, just adds the global fetch
}

declare module 'css-vars-ponyfill' {
  interface CssVarsOptions {
    include?: string;
    onlyLegacy?: boolean;
    watch?: boolean;
  }
  
  function cssVars(options?: CssVarsOptions): void;
  export default cssVars;
}

declare module 'es6-promise/auto' {
  // This module provides a polyfill for Promise
  // It doesn't export anything, just adds the global Promise
}