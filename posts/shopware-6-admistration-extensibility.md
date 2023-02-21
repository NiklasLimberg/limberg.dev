---
title: A detailed look at what makes the Shopware administration extensible
description: A post about how the Shopware 6 Administration works under the hood
date: 2023-02-17
---
<script>
import Header from '$lib/components/Header.svelte'
import InfoBox from '$lib/components/InfoBox.svelte'

</script>

<Header>

The Shopware 6 administration is not a normal Vue application, because it allows overriding and extending of nearly all parts of the application. This blog post explores the inner workings of the shopware component pipeline, from registering components and component overrides to the Vue component configuration that is passed into Vue.

Our journey starts at registering a simple Vue component, then we will extend the component, and then finally we will extend the component to build a Fizz buzz component. Admittedly, this is a contrived example, but it showcases the capabilities of the plugin system.

<InfoBox>

This blog post just glosses over the fact that components can be loaded asynchronously on demand, with the introduction of the `async-component-library`. So everything described here is in reality a bit more complicated.

</InfoBox>

</Header>

## The protagonists

The shopware component pipeline consists of 3 protagonists: the component factory, the template factory and the Vue adapter.

### The component factory

The component factory stores all component configurations, resolves overrides and produces the ready to use component configurations.

It stores component configurations in a Map with the following data structure:

```typescript
interface ComponentConfig<V extends Vue = Vue> extends ComponentOptions<V> {
	functional?: boolean,
	extends?: ComponentConfig<V> | string,
	_isOverride?: boolean,
}
```

The `ComponentConfig` type is largely just the default `ComponentOptions` type from Vue with a bit of special sauce on top, needed to resolve the overrides and extensions.

The journey of every component, override, and component extension starts here.

### The template factory

The template factory receives the templates from the component factory, keeps track of the overrides and extensions, and then renders the final component templates with [Twig.js](https://github.com/twigjs/twig.js/).

It stores template configurations in a Map with the following data structure:

```typescript=.d.ts
interface Template {
	name: string,
	raw: string,
	extend: string,
	overrides: {
    	index: number
    	raw: string
	}[],
}
```

<InfoBox>

Twig.js is pretty overkill for this application, where it's just used for having a way to override parts of templates. I'm thinking about replacing it with a lighter, homegrown alternative that doesn't have the baggage of being a full templating engine with conditionals and loops.

If your plugin would break without the full features of Twig.js, please [shoot me an email](mailto:niklas@limberg.dev)

</InfoBox>

### The Vue adapter

The Vue  Adapter bridges the gap from the component factory to the Vue instance.

It triggers the rendering of all component templates, gathers all component configurations and converts them to Vue asynchronous components.


## The Fizz Buzz example

Now on to an example. First, we will register a simple counter component. Then we will override it to this component with a decrement button. Finally, we will extend the counter print Fizz if the count is even and Buzz if the count is divisible by 3.

### Registering the basic counter

First off, let's create a template to be used for our basic counter:

```twig=base-counter-template.html.twig
{% block couter_container %}
<div>
	<div>Count: {{ count }}</div>

	<div>
    	{% block couter_controlls %}

    	{% block increment_button %}
    	<button @click="increment">
        	Increment
    	</button>
    	{% endblock %}

    	{% endblock %}
	</div>
</div>
{% endblock %}
```

Now we will add some TypeScript to register the component and make it interactive:

```javascript=base-counter-component.ts
import template from './base-counter-template.html.twig';

Shopware.Component.register('counter', {
	template,

	data() {
    	return {
        	count: 0,
    	};
	},

	methods: {
    	increment() {
        	this.count += 1;
        	return this.count
    	},
	},
});

```

<InfoBox>

You need to also import this TypeScript file somewhere and put it in an existing template somewhere, either by extending a component or simply editing an existing template directly.

</InfoBox>

Ok, this was simple enough, but what does it do under the hood.

![Diagram showing the flow of the Shopware.Component.register function](https://md.sw-bench.de/uploads/da2b9572-2573-472a-8e3a-5847032709da.svg)

`Shopware.Component.register()` checks in the map whether a component with the same name already exists and throws an error if so.

Then it extracts the template from the template key in the ComponentConfig and hands it over to the template factory with the `registerComponentTemplate` function. This then creates the following entry in the template registry:

```javascript=
const templateConfig: Template = {
	name: 'counter',
	raw: '<stringifyed twig template>',
	extend: '', // todo: check if this is actually false and not just an empty string
	overrides: [],
}
```

Finally, the `template` property is deleted from the component config and the rest of the `componentConfig` is then added to the `componentRegistry`

### Overriding components

Now we will override the `couter_controlls` twig block and add a `decerment` button:

```twig=counter-override.html.twig
{% block couter_controlls %}
{% parent() %}

<button @click="decrement">Decrement</button>
{% endblock %}
```

We will then register our template override and add a `decrement` method:

```javascript=counter-override.js
import template from './counter-overide-template.html.twig';

Shopware.Component.override('counter', {
	template,

	methods: {
    	decrement() {
        	this.count -= 1;
    	},
	},
});
```

The file extension `.js` here is not a mistake. TypeScript doesn't know about the `ComponentConfig` of the `counter` component we are overriding, which would then throw a bunch of errors. Well, and it kind of can't, because our override could be one in a chain of overrides. So the `ComponentConfig` partially depends on where it is in the override chain and what those overrides add to the `ComponentConfig` our override builds upon.

We could write a clever TypeScript type to resolve the `ComponentConfig` if we knew our location in the override chain, but sadly we can't because it depends on several factors like the order in which the `Shopware.Component.override()` is called.

![Diagram showing the flow of the Shopware.Component.override function](https://md.sw-bench.de/uploads/a33deb76-0d0a-4b0a-ae7c-2ae19c9ea8a9.svg)

If `Shopware.Component.override()` does not find an existing override config, then creates a new entry in the `componentOverride` with the value `[ComponentConfig]`. Otherwise, `ComponentConfig` is just pushed to the end of the array.

Then it calls `registerOverride`, which then either creates a new `Tempalte` object if none exists with:

```javascript
{
	name: 'counter',
	raw: '',
	extend: '', // todo: check if this is actually false and not just an empty string
	overrides: [{
    	raw: '<override template string>',
    	index: null
	}],
}
```

Otherwise, it pushes `{ raw: '<override template string>', index: null}` to the end of the overrides array.

It creates new entries in the `tempalteRegistry`, because the base template could be added later than the override template.

### Extending the components

Now on to our last showcase of the plugin system. Extending components works a little differently from adding overrides: Instead of modifying existing components, it copies the configuration including the template to a new entry in the component registry and then puts our component configuration on top.

Let's illustrate this, by adding Fizz Buzz based on the `counter` data property to our component.

```twig=template.html.twig
{% block couter_container_inner %}
<div>
	{% parent() %}
	{{ fizzBuzz }}
</div>
{% endblock %}
```

Now we will register the extension.

```javascript=fizz-buzz.js
import template from './template.html.twig';

Shopware.Component.extend('fizz-buzz', 'counter', {
	template,

	computed: {
    	fizzBuzz() {
        	const i = this.count;
        	let result = '';

        	if (i % 3 === 0) {
            	result += 'Fizz';
        	}

        	if (i % 5 === 0) {
            	result += 'Buzz';
        	}

        	if (result === '') {
            	result = i.toString();
        	}

        	return result;
    	},
	},
});
```

This results in the following data flow:

![Diagram showing the flow of the Shopware.Component.extend function](https://md.sw-bench.de/uploads/ddf674cb-ced0-4fa8-9f43-a69b482e637a.svg)

As mentioned before, component extensions create a new entry in the component library with a reference to the base component. This then look something like:

```typescript=
const componentRegistryEntry: ComponentConfig = {
	...componentConfig, // the passed in component config without the template
	functional: null, // todo check this
	extends: 'counter',
	_isOverride: false, // todo check this
}
```

Then it adds the following entry to the template repository:

```typescript=
const templateConfig: Template = {
	name: 'fizz-buzz',
	raw: '<stringifyed twig template>',
	extend: '', // todo: check if this is actually false and not just an empty string
	overrides: [],
}
```

The new component configuration resolves the overrides first if there were overrides applied to it, and then it gets layered on top of the resolved base component configuration.

### The virtual call stack

In the examples before, we were just adding methods without overriding existing methods, but what happens if we were to do so?

Then it builds a quite crude call stack, by iterating over all the overrides. It starts with the override that was added last and ends with the base component. The override that was added last gets the base method name, and every following override gets a hashtag added to the front of the method name. This leads to the last override being called first and the base method being called last.

Each override needs to call `this.$super('< method-name> ')` at least once to call the next method in the chain. `$super()` also returns the return value of the next method in the chain.

Let's see virtual call stack in action with the following example:

```javascript=
Shopware.Component.override('counter', {
	template,

	methods: {
    	increment(argument) {
        	console.log('argument', argument);
        	console.log('start of override 1');
        	const returnValue = this.$super('increment');
        	console.log('return value of base function', returnValue);
        	console.log('end of override 1');
        	return returnValue;
    	},
    	decrement() {
        	this.count -= 1;
    	},
	},
});

Shopware.Component.override('counter', {
	methods: {
    	increment() {
        	console.log('start of override 2');
        	const returnValue = this.$super('increment', 'This will be passed to override 1');
        	console.log('end of override 2');
        	return returnValue;
    	},
	},
});
```

Those two overrides would produce the following virtual call stack:

```javascript=
{
	increment: {
    	'##counter': {
        	parent: null,
        	func: '<function reference>'
    	},
    	'#counter': {
        	parent: '##sw-counter',
        	func: '<function reference>'
    	},
	}
}
```

The overrides would then log the following output when called:

```text=
start of override 2
start of override 1
start of base function
return value of base function 1
end of override 1
end of override 2
```

The virtual call stack is also created for computed properties in exactly the same way.

Extensions get added to the beginning of the call stack. Let's change the example we used to illustrate the extend feature to also override a method:

```javascript=
Shopware.Component.extend('fizz-buzz', 'counter', {
	template,

	computed: {
    	fizzBuzz() {
        	const i = this.count;
        	let result = '';

        	if (i % 3 === 0) {
            	result += 'Fizz';
        	}

        	if (i % 5 === 0) {
            	result += 'Buzz';
        	}

        	if (result === '') {
            	result = i.toString();
        	}

        	return result;
    	},
	},
    
	methods: {
    	increment() {
        	console.log('start of extension');
        	this.$super('increment');
        	console.log('end of extension');
    	},
	},
});
```

This would then log the following:

```txt=
start of extension
start of override 2
start of override 1
start of base function
return value of base function 1
end of override 1
end of override 2
end of extension
```

This whole thing is quite complicated, but it allows us to intervene before and after the next function in the call stack is called, and admittedly it works quite well. As long as `$super()` is being called synchronously, but more on that in [Appendix 1: The limitations of the virtual call stack](#Appendix-1-The-limitations-of-the-virtual-call-stack)

## The Vue Adapter

Now that we have explored how Vue components get registered in the shopware administration, we will take a look at the last leg to becoming a real functional Vue components. The Vue adapter is the glue between the component factory, the template factory and Vue.

It instructs the component factory to build the component config for each component based on the previously registered component configs and their overrides. Components created by extending another trigger the build of the component they depend on first, and then they will lay their customizations on top, as described in the previous chapter.

After every component is build, it instructs the template registry to render all the templates with `Twig.js`. This process happens in a similar vain to building components, first overrides are getting rendered in the order they were added, and then component extensions get rendered on top. This then produces the basic `HTML` template you know from Vue single file components.

And that's it we now have basic Vue components and their corresponding template, that we can just pass in to Vue.

## The road ahead

I hope this blog posts gave you insights into what shopware does to allow extensions to customize the administration.

It definitely has its problems and oversights that we will get into later, but works quite well for what it was build for back in 2020. When Vue 2 was still kind of new and TypeScript was only used by Hipsters *such as myself*.

This kind of changed with the continued adoption of TypeScript and the release of Vue 3 and its `Compostion` API.

TypeScript was introduced in 2022 into the administration, but just can not help when the existing plugin system is used because of its unpredictability. We could partially fix this by just providing types for the base component of the override/extension, but those types could also lie to you when other plugins are installed, which then potentially change the return type of whatever you are overriding.

This approach of merging `options API` based component configurations works quite well and would probably still work in Vue 3 with minor changes. That is because they are still just plain objects before they get passed into Vue.

## Appendix 1: The limitations of the virtual call stack

The virtual call stack works great as long as `$super()` is being called synchronously. It however breaks down completely if `$super()` is called asynchronously.

To illustrate this, let's look at an example by modifying the last override in the [chapter about the virtual call stack](#The-virtual-call-stack):

```javascript=
Shopware.Component.override('counter', {
	methods: {
    	increment() {
        	console.log('start of override 2');
        	return new Promise((resolve) => {
            	setTimeout(() => {
                	console.log('end of override 2');
                	resolve(this.$super('increment'));
            	}, 1000);
        	});
    	},
	},
});
```

So the only thing that has changed is that we are now returning a Promise and then calling `$super()` after a one-second delay, but if we look at the output we can quickly see that it ends up in an infinite loop:

```text=
start of extension
start of override 2
end of extension
start of override 2
end of override 2
start of override 2
end of override 2
start of override 2
<...>
```

To figure out what happens here, we will have to look at the source code for the `$super` function:

```typescript=async-component.factory.ts
$super(this: SuperBehavior, name, ...args) {
	this._initVirtualCallStack(name);

	const superStack = this._findInSuperRegister(name);

	const superFuncObject = superStack[this._virtualCallStack[name]];

	this._virtualCallStack[name] = superFuncObject.parent;

	const result = superFuncObject.func.bind(this)(...args);

	// reset the virtual call-stack
	if (superFuncObject.parent) {
    	this._virtualCallStack[name] = this._inheritedFrom();
	}

	return result;
},
```

You might have already spotted the culprit: The result of`superFuncObject.func.bind(this)(...args)` is not awaited, and the call chain is continuously restarted.

We can prevent this by looping our asynchronous override through a synchronous function, like this:

```typescript=
Shopware.Component.override('counter', {
	data() {
    	return {
        	asyncTaskIsComplete: false,
    	};
	},

	methods: {
    	async doSomething() {
        	await new Promise((resolve) => {
            	setTimeout(() => {
                	resolve();
            	}, 1000);
        	});

        	this.asyncTaskIsComplete = true;
        	this.increment();
    	},

    	increment() {
        	if (this.asyncTaskIsComplete) {
            	this.asyncTaskIsComplete = false;
            	this.$super('increment');

            	return;
        	}

        	this.doSomething();
    	},
	},
});
```

This is a dirty hack, but fixing this in shopware would break plugins.
