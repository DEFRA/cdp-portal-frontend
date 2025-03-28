import { runnerProfiles } from '~/src/server/test-suites/constants/runner-profiles.js'

const sizeTemplate = ({
  cpu,
  memory
}) => `<div><span>CPU:</span><span class="govuk-!-margin-left-1">${cpu.text}</span></div>
   <div><span>Memory:</span><span class="govuk-!-margin-left-1">${memory.text} (${memory.value} MB)</span></div>`

const provideFormValues = {
  method: () => {
    const runnerProfileOptions = [
      {
        value: 'regular',
        text: 'Regular',
        label: { classes: 'govuk-!-font-weight-bold' },
        hint: {
          html: sizeTemplate(runnerProfiles.regular)
        }
      },
      {
        value: 'large',
        text: 'Large',
        label: { classes: 'govuk-!-font-weight-bold' },
        hint: {
          html: sizeTemplate(runnerProfiles.large)
        }
      }
    ]

    const formDetail = {
      formValues: { runnerProfileOptions }
    }

    return formDetail
  },
  assign: 'formDetail'
}

export { provideFormValues }
