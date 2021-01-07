# Core concepts
These are the concepts that you need to understand. Don't worry, these concepts are just a matter of terms if you have alredy worked with any Javascript framework.

- **[Widget basics](#widget-basics)**
- **[Template](#template)**

## Widget basics

Widget is the basic building block of a Kyte project. Widgets are the individual pieces of the website which makes the whole webpage. These widgets may scale up from a small button as a widget to the entire page as a single widget.

A widget can be created using Kyte.js by
```js
class MyWidget extends Widget {
    // ...
}

```

Now let us see the properties of a Widget.

## Template

Template is the basically the content of the widget that is displayed to the DOM. This is just a string. All the HTML tags are valid.

```js
import { Widget } from 'kyte-js';

class App extends Widget {
    template = `
        <h1>Hello to Kyte.js</h1>
    `;
}
```

Now you can mount this as an app inorder to see the output. You can do this by using the Kyte object.

```js
import Kyte from 'kyte-js';

// ...

new Kyte({
    mount: new App(),
    root: '#app'
});
```
This mounts the widget in a DOM element with ID app.

```html
<div id="app"></div>
```