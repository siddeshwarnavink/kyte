# Kyte.js

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg) ![CI badge](https://github.com/siddeshwarnavink/kyte/workflows/CI/badge.svg) ![PRs status](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

A Javascript library for building Widgets.

[VIEW DOCUMENTATION](https://github.com/siddeshwarnavink/kyte/wiki/Core-concepts)

## Installation
### Install as a package
This is the recommended way to use Kyte. To install Kyte you have to install it as dependency

```
npm install --save kyte-js
```

Now you get access to Kyte.js features as follows.
```js
import Kyte, { Widget } from 'kyte-js';
```

#### Use the CDN
You can simply use the CDN to get started with Kyte. Although, it is recommended to install Kyte as a package and use it in case of a real app.

```html
<script src="https://cdn.jsdelivr.net/gh/siddeshwarnavink/kyte/dist/kyte-cdn.js"></script>
```
## Documentation

[View the documentation](https://github.com/siddeshwarnavink/kyte/wiki/Core-concepts) to know how to use kyte in your project


## Examples
You can find several example code in the ```examples``` folder. Here is a simple hello world example.

```js
import { Widget } from 'kyte-js';

class App extends Widget {
    template = `
        <h1>Hello to Kyte.js</h1>
    `;
}
```

This example will render "Hello to Kyte.js".

## Contributing

Contribution helps in making this library more stable. You can contribute to this library if you find any bugs or if you feel some things can be improved. But make sure that you read the [Contributing guidelines](https://github.com/siddeshwarnavink/kyte/wiki/Contributing-guidelines) first.
