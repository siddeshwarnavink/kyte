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

## Attrs
Attrs (or) Attributes are the data that passed from the parent component to the child component which pretty much helps in determining how the component is expected to render. These attrs can be simply passed just like a HTML attribute. For example,

> **Parrent component** is simply the component which mounts the required children components on itself. We can see this in-detail on [custom widgets](#custom-widgets) section.

```html
<my-widget userName="John doe"></my-widget>
<my-widget userName="Jane doe"></my-widget>
```

We can receive the value of all the attrs as ```attrs``` property in the widget.

```js
class MyWidget extends Widget {
    // ...

    logUsernameHandler = () => {
        console.log(this.attrs.userName);
    }
}
```

If these things sound confusing, don't worry, It'll become more clear when it is co-related with other upcoming concepts.

## Template

Template is the basically the content of the widget that is displayed to the DOM. This is just a string. All the HTML tags are valid.

```js
class App extends Widget {
    template = `
        <h1>Hello to Kyte.js</h1>
    `;
}
```

## Dynamic output

### String interpolation
String interpolation is a way to display dynamic content to the template. This mostly works with [State](#state) and [Attrs](#attrs) but it's not restricted to that.

#### Syntax

```
{{ dynamic_value }}
```

#### Example

```js
class App extends Widget {
    state = {
        userName: "John Garrett"
    };
    
    template = `
        <p>Hello {{ this.state.userName }}</p>

        <p>Now the it is {{ new Date().toDateString() }}</p>
    `;
}
```
#### Output
```
Hello John Garrett

Now the it is Fri Jan 08 2021
```

## Custom widgets

A widget can be also mounted in another widget's template. In this case, the widget which is being mounted is called as **child widget** and the widget which is mounting the child widget on itself is called a **parent widget**. In order to use a custom widget, the widget must be registered to ```widgets``` object of the component with the key as the 'tag name' and the value as the object of the widget. For example,

```js
class MyWidget extends Widget {
    template = `
        <p>Hello {{ this.attrs.userName }}.</p>
    `
}

class MyParrentWidget extends Widget {
    widgets = {
        'user-widget': MyWidget
    };

    template = `
        <user-widget userName="John deo"></user-widget>
        <user-widget userName="Nathen deo"></user-widget>
    `;
}
```

On mounting the ```MyParrentWidget``` to the DOM, we get the following output.

```
Hello John deo.

Hello Nathen deo.
```

Now, this may give a clear idea that how powerful the widgets are and clearly makes them a basic building block of Kyte.js project.