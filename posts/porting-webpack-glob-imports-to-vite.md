---
title: Porting Webpack glob imports to Vite
description:  An exploration into the Webpack `require.context` compiler macro, the code it produces, and the challenges of porting those Webpack glob imports to Vite.
date: 2023-08-26
---
<script>
import Header from '$lib/components/Header.svelte'
import InfoBox from '$lib/components/InfoBox.svelte'
import Image from '$lib/components/Image.svelte'
import DirectoryListing from '$lib/components/DirectoryListing.svelte'
</script>

<Header metadata="{metadata}">
Vite is a newer alternative to Webpack. It’s build for speed and provides a better developer experience, with native TypeScript and CSS preprocessor support. Vite consists of two major parts: a dev server that uses native ES modules that makes Hot Module Replacement incredibly fast, and a bundler that uses Rollup behind the scenes.

Porting from Webpack to Vite isn’t always easy. Especially if the code base used non web standard features of Webpack. This post explores one of the road blocks in the transition to Vite: The Webpack `require.context` compiler macro.

It looks into what the `require.context` macro does, the code it produces and the challenges of porting it to Vite.
</Header>


## How do glob imports work in Webpack?

Webpack supports importing multiple files by file path pattern matching. Glob imports come in handy if we want to include multiple files from a specific directory by name.

To illustrate this, we’ll look at the following file structure:

* main.js
* /components
    * button.js
    * button.spec.js
    * slider.js
    * slider.spec.js
* /services
    * /state
        * theme.js
    * i18n.js

<br>

For this example, we will try to import all component files without importing their respective test files. Notice that the test files can be identified by the `.spec.js` file ending.

According to the [webpack documentation](https://webpack.js.org/guides/dependency-management/#requirecontext), `require.context` has the following call signature:

```javascript
require.context(
  directory,
  (useSubdirectories = true),
  (regExp = /^\.\/.*$/),
  (mode = 'sync')
);
```

So let's plug in our values. We want to import all components from the component directory, so the first argument is going to be `./components`. Next is the `useSubdirectories` flag. We don’t have any subdirectories, so we can safely ignore that flag and set it to false for now. 

Now comes the tricky part, the regular expression. In our example, we want to include the components in our bundle while excluding their tests. So we’ll need a regular expression like this: `(?&lt;!\.spec)(\.js|\.ts)$`.

Lastly is the `mode` flag, we will just use the default sync for now and then later explore the other options. Put together, it would look like this:

```javascript
const context = require.context('./components', false, (?!\.spec)(\.js|\.ts)$) 
```

For now, this only imports the modules into the webpack context. We need another loop to import them on runtime:

```javascript
const context = require.context('./components', false, (!\.spec)(\.js|\.ts)$) 

context.keys(context)
```

Let’s take a look at the code this macro produces:

```javascript
var map = {
    "./counter.js": "./src/components/counter.js"
    "./display.js”: "./src/components/display.js"
};

function webpackContextResolve(req) {
    if(!__webpack_require__.o(map, req)) {
        var e = new Error("Cannot find module '" + req + "'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
}

    return map[req];
}

// this is the function that will replace our `require.context` call

function webpackContext(req) {
    var id = webpackContextResolve(req);

    return __webpack_require__(id);
}

webpackContext.keys = function webpackContextKeys() {
    return Object.keys(map);
};

webpackContext.resolve = webpackContextResolve;

module.exports = webpackContext;

webpackContext.id = "./src/components sync \\.js$";
```

Webpack adds two things for the glob import to our code:

* An object with a mapping to all imports that matched the regex in the `components` directory 
* A function that allows us to iterate over all matched imports and individually import them by component identifier when we want.

<InfoBox>

The fact that webpack allows us to control when the module will be imported and executed in the runtime will be important later in the conversion to Vite.

</InfoBox>

## A quick excursion into module imports in webpack


Webpack was invented before browsers had native module support with ES Modules. So webpack had to invent its own bespoke bundling format to make CommonJS work in browsers. 

Webpack’s default behavior is to bundle the complete module tree into a giant lookup table wrapped into an IFFE. All your regular CommonJS imports are replaced to call to the `__webpack_require__` lookup function seen in the code below: 

```javascript
function __webpack_require__(moduleId) {

   // Check if module is in cache
   var cachedModule = __webpack_module_cache__[moduleId];

   if (cachedModule !== undefined) {
      return cachedModule.exports;
   }

   // Create a new module (and put it into the cache)
   var module = __webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {}
   }

   // Execute the module function
   __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

   // Return the exports of the module
   return module.exports
}
```

ES Modules take a detour to the lookup table to preserve module scope, but they essentially work the same.

## The Vite replacement `import.meta.glob`

Vite is a modern build tool and uses native ES Modules in the dev mode and build output. Instead, it rearranges and transforms imports to work with browser native ES Module imports.
Vite’s alternative for `glob` imports is also implemented with a compiler macro. Let’s see how that would look like:

Input:

```javascript
const modules = import.meta.glob([['./components/*.js', '!./components/*.spec.js']])

for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

In contrast to Webpack, it doesn’t have any specialized behavior for importing modules in the runtime. Instead, it just replaces the `import.meta.glob` call with an object, where each entry is the import path of the module as the key and a dynamic import of that module as the value.

Output:

```javascript
const modules = {
  './components/button.js': () => import('./components/button.js'), 
  './components/slider.js': () => import('./components/slider.js'), 
}

for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

The largest difference to Webpack’s behavior is that we lose synchronous access to our resolved dependencies at a time of our choosing. Instead of just calling a function and getting a specific import returned, we now need to deal with promises.

### Eager imports

Vite also provides an `eager` configuration option for `glob` imports to synchronously import the modules instead of having to deal with promises.

Input:

```javascript
const modules = import.meta.glob([['./components/*.js', '!./components/*.spec.js']], { eager: true })
```

This replaces the dynamic imports with static imports and which in return gets used as values in the map.

Output:

```javascript
import * as __glob__0_0 from './components/button.js'
import * as __glob__0_1 from './components/slider.js'

const modules = {
  './components/button.js': __glob__0_0,
  './components/slider.js': __glob__0_1,
}
```

This might seem like it could replace our webpack implementation from the beginning, but it isn’t. That’s because it doesn’t give us any control over the execution timing of the modules, as webpack or Vite with the headache of promises did.

<InfoBox>

The previous sections just glossed over that Vite does bundle for production builds.

</InfoBox>

## The execution order of ES Modules

ES Modules imports follow a left-to-right post-order traversal without giving us, the developer, any control over when a module is executed. Modules are executed as soon as they are imported with an `import` statement.

This loss of control over when the `glob` imported modules are executed, could lead to timing issues, when the code that is imported needs to run after a specific module. If that required module is located after the imported module, there is no way to restructure the import tree.

To visualize this, let's look at an import tree:


<Image src="/img/porting-webpack-glob-imports-to-vite/directory-structure.png" altSrc="/img/porting-webpack-glob-imports-to-vite/directory-structure.webp" alt="A directory tree with two main branches `/components and `/services`. `button.js` is located in the `components` directory. `theme.js` is located in `/services/state/` to the right of the `components` directory" width="895" height="800" /> 

For this example, we’ll assume that the `glob` imported module `button.js` component needs to access some kind of global state from exposed by `theme.js`. 

In Webpack, this wouldn’t be an issue, because we can just call the context function that executes the `button.js` component after the `theme.js` module is executed and has set up the global state it needs. In Vite, this would cause timing issues, because we can’t control the execution timing. `button.js` is to the left of `theme.js`, so that is what is executed first.

In this pretty simple example, this would be easy to fix. But in larger applications with more interdependencies, it's not as easy to rearrange the imports. 

## Making the switch to Vite behind a feature flag

Switching between Webpack and Vite might seem easy with a feature flag. Just detect what bundler is being used and then toggle between the two `glob` import implementations.

Something like this:

```javascript
export function importComponents() {
   if(typeof require.context === ‘function’) {
       const context = require.context(‘./components’, false, (?&lt;!\.spec)(\.js|\.ts)$)
       return Object.fromEntries(context.keys().map(key => ([key, context(key)])))
   } else {
       return import.meta.glob('./components/*.js', { eager: true })
   }
}
```

This would work in Vite, but I could also incur an increased maintenance burden for the duration of the transition. Changes need to be potentially tested in both build tools, to ensure that they work.

For example, certain code could work fine in Webpack, but then completely break with the activation of the feature flag. This can happen, because the exact same code bundled by Webpack implicitly waits for some global state or similar to be set up. Vite instead just assumes that modules can be imported and therefore executed in the previously described order of ES Modules.


## Glob imports in the shopware administration 

The shopware administration starts with a predefined [boot process](https://github.com/shopware/platform/blob/trunk/src/Administration/Resources/app/administration/src/core/application.ts#L341C11-L341C11). It loads plugins, provides services and builds Vuex stores and Vue components.

`glob` imports are extensively used in that boot process to for example import all components and all services in one go, instead of having separate imports for each component and service.

But here is also one of the problems with transitioning the shopware administration to Vite. 

The current shopware boot process relies in a few instances on the Webpack behavior of being able to import modules, before executing them later in the boot process

Some components and services rely on being imported, but not being executed before some global state like stores or base classes are registered to the `Shopware` object that is bound to the `window` object.


## Conclusion

`glob` imports are useful to reduce the amount of manual imports. But they, like other bundler specific features, become problematic if they introduce non web standard behavior. Like modules not being executed upon being imported.

Further reference:
* [ES6 In Depth: Modules - Mozilla Hacks - the Web developer blog](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/)
* [ECMAScript® 2024 Language Specification - 16.2 Modules](https://tc39.es/ecma262/#sec-ecmascript-language-scripts-and-modules)
* [Execution order of JavaScript modules | by Marian Čaikovski](https://marian-caikovski.medium.com/execution-order-of-javascript-modules-ddaca4561220)
