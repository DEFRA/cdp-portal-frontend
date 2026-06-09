# formEngine plugin

Defines an extensible form page defined by the Joi schema used to validate and transform the form data.

## Usage

```js
server.register({
  plugin: formEngine,
  options: {
    route: {
      path: '/some/resource/{id}',
    },
    layout: 'layouts/resource.njk',
    async schema(request) {
      retun Joi.object({
        username: Joi.string()
          .label('Username')
          .description('Your username')
          .required()
          .min(3)
          .max(20)
      })
    },
    async actions(request, h) {
      submit: {
        text: 'Save',
        async method(request, h, sanitisedFormValues) {
          ....

          return h.redirect('/some/resource')
        }
      },
      cancel: {
        text: 'Cancel',
        url: '/some/resource'
      }
    }

```

## API

### options.route (required)

A Hapi route definition for the form page. A GET method is used for the view and a POST for the form submission.

### options.layout (required)

The view template to use the for page. Should contain a Nunjucks block `{% block formContent %}{% endblock %}` definition, which is where the form will be rendered.

### options.schema (required)

Async function returning the Joi schema defining the form. This is used for validation and transformation of the result, as well as the visual rendering of the form. Each sub-schema in the main object defines a field in the form.

The following schema options are used to render each field.

| Option                  | Renders                        |
| ----------------------- | ------------------------------ |
| label()                 | Label                          |
| description()           | Hint                           |
| optional()              | Adds ("optional") to the Label |
| default()               | Default value for the field    |
| meta({ component: "" }) | Override the Nunjucks macro    |

There are a set of predefined Nunjucks macros for common field types. Custom macros can also be used, if included in the template defined by `options.layout`.

### options.actions (required)

Async function returning returning a object defining the buttons to appear at the end of the form. Each action should have a `text` property with the label to use, and either a `url` property to render a link or a `method` property to render a button and have this function run on submission without validation errors.
The `classes` property can be used to add custom classes to the action.

The `method` function is called with the Hapi `request` and `h` values, but also a `sanitisedFormValues` which is the result form the Joi validation with its associated transforms.

### options.load (optional)

Async function returning the initial form values to use. This can be used to load a resource into the form when being used in an Edit capacity. Return `undefined` to use the forms default values.

### options.ext (optional)

Hapi server extensions. A common usage would be to define `context` items to render in the layout.

```js
;[
  {
    type: 'onPostHandler',
    method: (request, h) => {
      if (request.response.variety !== 'view') {
        return h.continue
      }
      const response = request.response
      response.source.context = response.source.context
        ? response.source.context
        : {}

      response.source.context.title = 'My Form'

      return h.continue
    },
    options: { sandbox: 'plugin' }
  }
]
```
