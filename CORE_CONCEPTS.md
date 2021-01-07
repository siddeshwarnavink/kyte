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

To see the widget in action, it has to be mounted to the DOM. 

```js
import Kyte from 'kyte-js';

// ...

new Kyte({
    mount: new MyWidget(),
    root: '#app'
});
```

Now this mounts the widget to a element with ID app, like for example

```html
<div id="app"></div>
```

Now let us see the properties of a Widget.

## State

State is the internal value of the Widget which determins how the widget shoud be displayed. For example

```js
class MyWidget extends Widget {
    state = {
        userName: 'John doe',
        displayInfo: false
    }

    // ...
}
```

In this example, we can see the ```displayInfo``` is ```false```. According to this, we can manipulate the [template](#template) and show different output. We can see how that can be done in the dynamic output section.

We can update the value in the state by using ```updateState``` function

```js
class MyWidget extends Widget {
    // ...

    toggleDisplay = () => {
        this.updateState(() => {
            this.state.displayInfo = !this.state.displayInfo;
        });
    }
}
```

## Template

Template is the basically the content of the widget that is displayed to the DOM. This is just a string. All the HTML tags are valid.

```js
class App extends Widget {
    template = `
        <h1>Hello to Kyte.js</h1>
    `;
}
```