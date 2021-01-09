# Kyte.js
A Javascript library for building Widgets.

[VIEW DOCUMENTATION](./CORE_CONCEPTS.md)

## Installation
This library is not yet published in npm as it is in its early stages of development. So you need to get the project in order to work with it.

#### Get the project setup
First clone this repository.

```
git clone <repo-url>
```

Then install all the dependency. Make sure you're using Node.js version mentioned in the ```.nvmrc``` file for better compatibility

```
nvm use
yarn install
```

Now you can run the build script to get a compiled library code in the ```dist``` folder which you can integrate with your project.

#### Option 1: Installing as dependency
You can install the project folder as a dependency by simply running

```
yarn add file:./path/to/kyte/
```

This option can be used when you're using the library inside a workflow like Webpack.

#### Option 2: Script import directly
It is the version which you can use if you have for a static HTML project (no workflow). You can simply import the script

```html
<script src="./path/to/kyte/dist/kyte-cdn.js"></script>
```

Now, this exposes a global variable ```Kyte``` which has all the features of the library.

## Documentation

You can simply click the link below to view the documentation.

[VIEW DOCUMENTATION](./CORE_CONCEPTS.md)


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

Contribution helps in making this library more stable. You can contribute to this library if you find any bugs or if you feel some things can be improved. But before you do so, make sure you read the [Contributing Guide](./CONTRIBUTING.md) to get a clear understanding of the project structure.