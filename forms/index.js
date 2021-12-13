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
const createPuzzleForm = (themes, sizes, age_groups, difficulty_levels, materials, tags) => {
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
            validators: [validators.integer(), validators.min(0)]
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
            validators: [validators.integer(), validators.min(0)]
        }),
        'length': fields.number({
            label: 'Length (in cm)',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer(), validators.min(0)]
        }),
        'breadth': fields.number({
            label: 'Breadth (in cm)',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer(), validators.min(0)]
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

// Create search order form
const createSearchOrderForm = (status, puzzle, users) => {
    return forms.create({
        'order_status_id': fields.string({            
            required: false,
            errorAfterField: true,
            label: "Order Status",
            cssClasses: {
                label:['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: status
        }),
        'puzzle_id': fields.string({
            required: false,
            errorAfterField: true,
            label: "Puzzle",
            cssClasses: {
                label:['form-label']
            },
            'widget': widgets.multipleSelect(),
            choices: puzzle
        }),
        'user_id': fields.string({
            required: false,
            errorAfterField: true,
            label: "User",
            cssClasses: {
                label:['form-label']
            },
            'widget': widgets.multipleSelect(),
            choices: users
        })

    })
}

// Create Search Listing form
const createSearchListingForm = (themes, sizes, ageGroups, difficultyLevels, materials) => {
    return forms.create({
        'title': fields.string({            
            required: false,
            errorAfterField: true,
            cssClasses: {
                label:['form-label']
            }
        }),
        'stock': fields.string({
            required: false,
            validators: [validators.integer(), validators.min(0)],
            errorAfterField: true,
            label: "Stock Count Below",
            cssClasses: {
                label:['form-label']
            }       
        }),
        'theme_id': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label:['form-label']
            },
            label: "Theme",
            choices: themes,
            widget: widgets.multipleSelect()     
        }),
        'size_id': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label:['form-label']
            },
            label: "Sizes (Pieces)",
            choices: sizes,
            widget: widgets.multipleSelect()
        }),
        'age_group_id': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label:['form-label']
            },
            label: "Age Groups",
            choices: ageGroups,
            widget: widgets.multipleSelect()
        }),
        'difficulty_level_id': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label:['form-label']
            },
            label: "Difficulty Levels",
            choices: difficultyLevels,
            widget: widgets.multipleSelect()
        }),
        'material_id': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label:['form-label']
            },
            label: "Materials",
            choices: materials,
            widget: widgets.multipleSelect()
        })
    })
}

module.exports = { createPuzzleForm, 
                bootstrapField, 
                createRegistrationForm, 
                createLoginForm, 
                createUpdateOrderForm, 
                createSearchOrderForm,
                createSearchListingForm };