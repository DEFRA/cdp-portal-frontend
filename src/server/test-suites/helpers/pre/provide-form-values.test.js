import { provideFormValues } from './provide-form-values.js'
import { scopes } from '@defra/cdp-validation-kit'

describe('#provideFormValues', () => {
  const entity = { teams: [{ teamId: 'team1' }], subType: 'Journey' }

  test('Should provide expected values for an authenticated user', async () => {
    const mockRequest = {
      getUserSession: vi.fn().mockResolvedValue({
        isAuthenticated: true,
        isAdmin: false,
        scope: []
      }),
      app: { entity },
      userIsOwner: vi.fn().mockResolvedValue(false),
      userIsAdmin: vi.fn().mockResolvedValue(false)
    }
    const result = await provideFormValues.method(mockRequest)

    expect(result).toEqual({
      environmentOptions: [],
      runnerConfigOptions: []
    })
  })

  test('Should return expect values for an unauthenticated user', async () => {
    const mockRequest = {
      getUserSession: vi.fn().mockResolvedValue({ isAuthenticated: false }),
      userIsOwner: vi.fn().mockResolvedValue(false),
      userIsAdmin: vi.fn().mockResolvedValue(false)
    }

    const result = await provideFormValues.method(mockRequest)

    expect(result).toEqual({
      environmentOptions: [],
      runnerConfigOptions: []
    })
  })

  test('Should return expected values for a test suite owner', async () => {
    const mockRequest = {
      getUserSession: vi.fn().mockResolvedValue({
        isAuthenticated: true,
        isAdmin: false,
        scope: ['team:team1', `${scopes.serviceOwner}:team:team1`]
      }),
      app: { entity },
      userIsOwner: vi.fn().mockResolvedValue(true),
      userIsAdmin: vi.fn().mockResolvedValue(false)
    }
    const result = await provideFormValues.method(mockRequest)

    expect(result).toEqual({
      environmentOptions: [
        {
          attributes: {
            selected: true
          },
          disabled: true,
          text: ' - - select - - ',
          value: ''
        },
        {
          text: 'dev',
          value: 'dev'
        },
        {
          text: 'test',
          value: 'test'
        },
        {
          text: 'perf-test',
          value: 'perf-test'
        },
        {
          text: 'prod',
          value: 'prod'
        }
      ],
      runnerConfigOptions: [
        {
          checked: true,
          hint: {
            html: '<div><span>CPU:</span><span class="govuk-!-margin-left-1">4 vCPU</span></div>\n   <div><span>Memory:</span><span class="govuk-!-margin-left-1">8 GB</span></div>'
          },
          label: {
            classes: 'govuk-!-font-weight-bold'
          },
          text: 'Regular',
          value: 'regular'
        },
        {
          hint: {
            html: '<div><span>CPU:</span><span class="govuk-!-margin-left-1">8 vCPU</span></div>\n   <div><span>Memory:</span><span class="govuk-!-margin-left-1">16 GB</span></div>'
          },
          label: {
            classes: 'govuk-!-font-weight-bold'
          },
          text: 'Large',
          value: 'large'
        }
      ]
    })
  })

  test('Should return expected values for an admin user', async () => {
    const mockRequest = {
      getUserSession: vi.fn().mockResolvedValue({
        isAuthenticated: true,
        isAdmin: true,
        scope: [scopes.admin]
      }),
      app: { entity },
      userIsOwner: vi.fn().mockResolvedValue(false),
      userIsAdmin: vi.fn().mockResolvedValue(true)
    }
    const result = await provideFormValues.method(mockRequest)

    expect(result).toEqual({
      environmentOptions: [
        {
          attributes: {
            selected: true
          },
          disabled: true,
          text: ' - - select - - ',
          value: ''
        },
        {
          text: 'infra-dev',
          value: 'infra-dev'
        },
        {
          text: 'management',
          value: 'management'
        },
        {
          text: 'dev',
          value: 'dev'
        },
        {
          text: 'test',
          value: 'test'
        },
        {
          text: 'perf-test',
          value: 'perf-test'
        },
        {
          text: 'prod',
          value: 'prod'
        }
      ],
      runnerConfigOptions: [
        {
          checked: true,
          hint: {
            html: '<div><span>CPU:</span><span class="govuk-!-margin-left-1">4 vCPU</span></div>\n   <div><span>Memory:</span><span class="govuk-!-margin-left-1">8 GB</span></div>'
          },
          label: {
            classes: 'govuk-!-font-weight-bold'
          },
          text: 'Regular',
          value: 'regular'
        },
        {
          hint: {
            html: '<div><span>CPU:</span><span class="govuk-!-margin-left-1">8 vCPU</span></div>\n   <div><span>Memory:</span><span class="govuk-!-margin-left-1">16 GB</span></div>'
          },
          label: {
            classes: 'govuk-!-font-weight-bold'
          },
          text: 'Large',
          value: 'large'
        }
      ]
    })
  })
})
