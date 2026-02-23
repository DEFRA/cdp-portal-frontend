import { fetchTestRuns } from '../../helpers/fetch/fetch-test-runs.js'
import { sortByEnv } from '../../../common/helpers/sort/sort-by-env.js'
import { formatISO, format, differenceInMinutes, subMinutes } from 'date-fns'
import { testSuiteRunResults } from '../../transformers/test-suite-run-results.js'
import { environments } from '../../../../config/environments.js'
import { buildOptions } from '../../../common/helpers/options/build-options.js'
import Joi from 'joi'

const shortISO = "yyyy-MM-dd'T'HH:mm"

const runningTestsController = {
  options: {
    validate: {
      query: Joi.object({
        start: Joi.date().iso().default(subMinutes(new Date(), 30)),
        end: Joi.date().iso().default(new Date()),
        environment: Joi.string()
      })
    }
  },
  handler: async (request, h) => {
    const query = request.query

    const { testRuns } = await fetchTestRuns({
      start: formatISO(query.start),
      end: formatISO(query.end),
      environment: query.environment ?? null
    })

    const rows = testRuns
      .toSorted((a, b) => sortByEnv(a.environment, b.environment))
      .map((t) => testSuiteRunResults(t, false))

    const allEnvs = Object.keys(environments).map((environment) => ({
      value: environments[environment].kebabName,
      text: environments[environment].kebabName
    }))
    const environmentOptions = buildOptions(allEnvs, true)

    return h.view('test-suites/views/running-tests', {
      pageTitle: `Running Tests`,
      timeRange: `Tests run in the last ${differenceInMinutes(query.end, query.start)} minutes`,
      clearUrl: '/running-tests',
      environmentOptions,
      formData: {
        environment: query.environment,
        start: format(query.start, shortISO),
        end: format(query.end, shortISO)
      },
      tableData: {
        headers: [
          { id: 'testsuite', text: 'Test Suite', width: '5' },
          { id: 'version', text: 'Version', width: '5' },
          { id: 'environment', text: 'Env', width: '7' },
          { id: 'status', text: 'Status', width: '7' },
          { id: 'user', text: 'Run By', width: '12' },
          { id: 'duration', text: 'Duration', width: '10' },
          { id: 'last-run', text: 'Last Run', width: '15' }
        ],
        rows
      },
      breadcrumbs: [
        {
          text: 'Test suites',
          href: '/test-suites'
        },
        {
          text: 'Running Tests',
          href: `/running-tests`
        }
      ]
    })
  }
}

export { runningTestsController }
