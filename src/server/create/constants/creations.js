export function getCreations(prototypesDisabled = false) {
  const entries = [
    [
      'microservice',
      {
        kind: 'microservice',
        title: 'Microservice',
        hint: 'A loosely coupled service that can be deployed independently and is responsible for a single business capability. Our Node.js and Dotnet templates provide a starting point for creating a new frontend or backend microservice'
      }
    ],
    [
      'journey-test-suite',
      {
        kind: 'journey-test-suite',
        title: 'Journey Test Suite',
        hint: 'A collection of tests that verify the user journeys within a microservice. These tests use the WDIO framework and can be run against a deployed environment or against a docker compose in a GitHub workflow'
      }
    ],
    [
      'perf-test-suite',
      {
        kind: 'perf-test-suite',
        title: 'Performance Test Suite',
        hint: 'A collection of tests that verify the performance of a microservice. These tests use JMeter and can be run against the "perf-test" environment'
      }
    ],
    ...(prototypesDisabled
      ? []
      : [
          [
            'prototype',
            {
              kind: 'prototype',
              title: 'Prototype',
              hint: 'A service built upon the GOV.UK prototype kit'
            }
          ]
        ]),
    [
      'repository',
      {
        kind: 'repository',
        title: 'Repository',
        hint: 'A container for a collection of files that are versioned and stored in DEFRA GitHub'
      }
    ]
  ]

  return Object.fromEntries(entries)
}
