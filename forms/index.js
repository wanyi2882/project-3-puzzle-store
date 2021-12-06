// Import in caolan forms
const forms = require("forms");

// Create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;


// Bootstrap
var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

// Create a puzzle form 
const createPuzzleForm = (themes, sizes, age_groups, difficulty_levels, materials, tags, frames) => {
    return forms.create({
        'title': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'cost': fields.number({
            label: 'Cost (in Cents)',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'stock': fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'length': fields.number({
            label: 'Length (in cm)',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'breadth': fields.number({
            label: 'Breadth (in cm)',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'brand': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'theme_id': fields.string({
            label: 'Theme',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: themes
        }),
        'size_id': fields.string({
            label: 'Pieces',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: sizes
        }),
        'age_group_id': fields.string({
            label: 'Age Group',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: age_groups
        }),
        'difficulty_level_id': fields.string({
            label: 'Difficulty Level',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: difficulty_levels
        }),
        'material_id': fields.string({
            label: 'Material',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: materials
        }),
        'tags': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: tags
        }),
        'frames': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: frames
        }),
        'image': fields.string({
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.hidden(),
            validators: [validators.url()]
        })
    })
};

// Create registration form
const createRegistrationForm = () => {
    return forms.create({
        'username': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'email': fields.email({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.email()]
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.minlength(8)]
        }),
        'confirm_password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.matchField('password')]
        })
    })
}

// Create login form
const createLoginForm = () => {
    return forms.create({
        'email': fields.email({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            validators: [validators.email()]
        }),
        'password': fields.password({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            'widget': widgets.password(),
            validators: [validators.minlength(8)]
        })
    })
}

// Create update order form
const createUpdateOrderForm = (status) => {
    return forms.create({
        'shipping_address': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            }
        }),
        'status': fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                'label': ['form-label']
            },
            widget: widgets.select(),
            choices: status
        })
    })
}

module.exports = { createPuzzleForm, bootstrapField, createRegistrationForm, createLoginForm, createUpdateOrderForm };