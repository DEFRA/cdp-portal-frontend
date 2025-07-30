export function getCreations() {
  return [
    {
      value: 'microservice',
      text: 'Microservice',
      hint: `A loosely coupled service that can be deployed independently and is responsible for a single business capability. Our Node.js and Dotnet templates provide a starting point for creating a new frontend or backend microservice`
    },
    {
      value: 'journey-test-suite',
      text: 'Journey Test Suite',
      hint: `A collection of tests that verify the user journeys within a microservice. These tests use the WDIO framework and can be run against a deployed environment or against a docker compose in a GitHub workflow`
    },
    {
      value: 'perf-test-suite',
      text: 'Performance Test Suite',
      hint: `A collection of tests that verify the performance of a microservice. These tests use JMeter and can be run against the "perf-test" environment`
    },
    {
      value: 'prototype',
      text: 'Prototype',
      hint: 'A service built upon the GOV.UK prototype kit'
    },
    {
      value: 'repository',
      text: 'Repository',
      hint: 'A container for a collection of files that are versioned and stored in DEFRA GitHub'
    }
  ].map((creation) => ({
    ...creation,
    label: { classes: 'govuk-!-font-weight-bold' },
    hint: { text: creation.hint }
  }))
}
