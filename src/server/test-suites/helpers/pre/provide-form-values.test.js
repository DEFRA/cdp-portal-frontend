import { provideFormValues } from '~/src/server/test-suites/helpers/pre/provide-form-values.js'

describe('#provideFormValues', () => {
  const entity = { teams: [{ teamId: 'team1' }], subType: 'Journey' }

  test('Should provide expected values for an authenticated user', async () => {
    const mockRequest = {
      getUserSession: jest
        .fn()
        .mockResolvedValue({ isAuthenticated: true, isAdmin: false }),
      app: { entity },
      userIsOwner: jest.fn().mockResolvedValue(false),
      userIsAdmin: jest.fn().mockResolvedValue(false)
    }
    const result = await provideFormValues.method(mockRequest)

    expect(result).toEqual({
      environmentOptions: [],
      runnerProfileOptions: []
    })
  })

  test('Should return expect values for an unauthenticated user', async () => {
    const mockRequest = {
      getUserSession: jest.fn().mockResolvedValue({ isAuthenticated: false }),
      userIsOwner: jest.fn().mockResolvedValue(false),
      userIsAdmin: jest.fn().mockResolvedValue(false)
    }

    const result = await provideFormValues.method(mockRequest)

    expect(result).toEqual({
      environmentOptions: [],
      runnerProfileOptions: []
    })
  })

  test('Should return expected values for a test suite owner', async () => {
    const mockRequest = {
      getUserSession: jest
        .fn()
        .mockResolvedValue({ isAuthenticated: true, isAdmin: false }),
      app: { entity },
      userIsOwner: jest.fn().mockResolvedValue(true),
      userIsAdmin: jest.fn().mockResolvedValue(false)
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
      runnerProfileOptions: [
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
      getUserSession: jest
        .fn()
        .mockResolvedValue({ isAuthenticated: true, isAdmin: true }),
      app: { entity },
      userIsOwner: jest.fn().mockResolvedValue(false),
      userIsAdmin: jest.fn().mockResolvedValue(true)
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
      runnerProfileOptions: [
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
