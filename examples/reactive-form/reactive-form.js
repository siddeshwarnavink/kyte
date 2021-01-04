/**
 * Utils
 */

function validations(name, value, validation, args) {
    switch (validation) {
        case "Required":
            if (value.trim() === "") {
                return `${name} is required`
            }
            return true;

        case "MinLen":
            if (`${value}`.length < parseInt(args[0])) {
                return `${name} should be atleast ${args[0]} characters long!`
            }
            return true;

        case "MaxLen":
            if (`${value}`.length > parseInt(args[0])) {
                return `${name} should be upto ${args[0]} characters long!`
            }
            return true;

        case "Email":
            if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value))) {
                return "Enter a valid e-mail address";
            }
            return true;
    }
}

class Validator {
    errorHandler;

    constructor(errorHandler) {
        this.errorHandler = errorHandler;
    }

    validate(formFieldMapping) {
        formFieldMapping.forEach(formField => {
            formField.validations.forEach(validation => {
                const validationName = validation.split(':')[0];
                const args = validation.split(':');
                args.shift();

                const fieldIsValid = validations(formField.name, formField.value, validationName, args.map(arg => `${arg}`.trim()));

                if (fieldIsValid !== true) {
                    this.errorHandler.push(formField.ident, fieldIsValid);
                }
            });
        });
    }
}

class ErrorHandler {
    errors = {};

    push(key, value) {
        if (!this.errors[key]) {
            this.errors[key] = [];
        }

        this.errors[key].push(value);
    }

    hasErrors() {
        return Object.keys(this.errors).length !== 0;
    }

    clearErrors() {
        this.errors = {};
    }

    getErrors() {
        return this.errors;
    }

    get(key) {
        return this.errors[key];
    }
}

/**
 * UI widget
 */

class AppInput extends Kyte.Widget {
    defaultAttrs = {
        type: 'text'
    };

    state = {
        inputValue: ''
    }

    template = `
        <div class="appInput">
            <label>{{ this.attrs.label }}</label>
            <input
                #bind={this.state.inputValue}
                [type]="this.attrs.type"
                [placeholder]="this.attrs.placeholder" 
            />

            <span class="appInput__error">
                {{ this.getError() }}
            </span>
        </div>
    `;

    getError() {
        if (this.attrs.error) {
            return this.attrs.error[0]
        }
        return '';
    }
}

class AppButton extends Kyte.Widget {
    defaultAttrs = {
        theme: "primary",
        type: "button"
    };

    getClassNames = () => {
        const cssClasses = ['appButton'];

        switch (this.attrs.theme) {
            case "secondary":
                cssClasses.push('secondary');
                break;
        }

        return cssClasses.join(' ');
    }

    template = `
        <button [class]="this.getClassNames()" [type]="this.attrs.type">
            <kyte-children />
        </button>
    `;
}

class SuccessTick extends Kyte.Widget {
    template = `    
        <div class="animation-ctn">
            <div class="icon icon--order-success svg">
                <svg xmlns="http://www.w3.org/2000/svg" width="154px" height="154px">  
                    <g fill="none" stroke="#22AE73" stroke-width="2"> 
                        <circle cx="77" cy="77" r="72" style="stroke-dasharray:480px, 480px; stroke-dashoffset: 960px;"></circle>
                        <circle id="colored" fill="#22AE73" cx="77" cy="77" r="72" style="stroke-dasharray:480px, 480px; stroke-dashoffset: 960px;"></circle>
                        <polyline class="st0" stroke="#fff" stroke-width="10" points="43.5,77.8 63.7,97.9 112.2,49.4 " style="stroke-dasharray:100px, 100px; stroke-dashoffset: 200px;"/>   
                    </g> 
                </svg>
            </div>
        </div>
    `;
}

/**
 * Main App widget
 */

class MyApp extends Kyte.Widget {
    widgets = {
        'app-input': AppInput,
        'app-button': AppButton,
        'app-success-tick': SuccessTick
    };

    state = {
        pagination: {
            currentPage: 1,
            totalPage: 2
        },
        errors: {},
        formData: {}
    };

    template = `
        <main class="page-container">
            <main :if="this.state.pagination.currentPage === 1">
                <h1 class="page-container__title">Create an account</h1>
                <form #submit={this.handleSubmit}>
                    <app-input ref="nameInput" [error]="this.state.errors.name" label="Your name" placeholder="John Doe">
                    </app-input>

                    <app-input ref="emailInput" [error]="this.state.errors.email" label="E-mail Address"
                        placeholder="john@example.com"></app-input>

                    <app-input ref="pwdInput" [error]="this.state.errors.password" label="Password" type="password"
                        placeholder="************"></app-input>

                    <section class="button-bar">
                        <app-button :if="this.state.pagination.currentPage > 1" theme="secondary">
                            Back
                        </app-button>
                        <app-button type="submit">
                            Next
                        </app-button>
                    </section>
                </form>
            </main>
            <main :if="this.state.pagination.currentPage === 2">
                <app-success-tick></app-success-tick>

                <section class="succes-message">
                    <h1>Account created</h1>
                    <p>Welcome {{ this.state.formData.username }}!</p>
                </section>
            </main>
        </main>
    `;

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.pagination.currentPage === 1) {
            // Page 1
            const username = this.refs.nameInput.widget.state.inputValue;
            const email = this.refs.emailInput.widget.state.inputValue;
            const password = this.refs.pwdInput.widget.state.inputValue;

            const errorHandler = new ErrorHandler();
            const validator = new Validator(errorHandler);

            validator.validate([
                {
                    ident: 'name',
                    name: 'Username',
                    value: username,
                    validations: [
                        'Required',
                        'MinLen:3',
                        'MaxLen: 10'
                    ]
                },
                {
                    ident: 'email',
                    name: 'E-mail',
                    value: email,
                    validations: [
                        'Required',
                        'Email',
                    ]
                },
                {
                    ident: 'password',
                    name: 'Password',
                    value: password,
                    validations: [
                        'Required',
                        'MinLen:5',
                    ]
                }
            ]);

            if (errorHandler.hasErrors()) {
                this.updateState(() => {
                    this.state.errors = errorHandler.getErrors();
                });
            } else {
                this.updateState(() => {
                    this.state.errors = {}
                    this.state.formData = {
                        username,
                        email,
                        password
                    }
                    this.state.pagination.currentPage++;
                });
            }
        }
    }
}

new Kyte({
    mount: new MyApp(),
    root: '#app'
});