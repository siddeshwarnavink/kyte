const defaultConfiguration = {
	root: '#app'
};

class App {
	constructor(config) {
		config = {
			...defaultConfiguration,
			...config
		};
        
		this.mountApp(config.mount, config.root);
	}

	mountApp(widget, root) {
		widget.mount(document.querySelector(root));
	}
}

export default App;