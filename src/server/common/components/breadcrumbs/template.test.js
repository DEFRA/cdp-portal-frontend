import { beforeEach, describe, expect, test } from 'vitest'
import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'

describe('Breadcrumbs Component', () => {
  let $breadcrumbs

  beforeEach(() => {
    $breadcrumbs = renderTestComponent('breadcrumbs', {
      items: [
        {
          text: 'Deployments',
          href: '/deployments'
        },
        {
          text: 'Magic service'
        }
      ]
    })('[data-testid="app-breadcrumbs"]').first()
  })

  test('Should render expected number of breadcrumbs', () => {
    expect(
      $breadcrumbs.find('[data-testid="app-breadcrumbs-list-item"]')
    ).toHaveLength(2)
  })

  test('First breadcrumb should be a link', () => {
    const $firstBreadcrumbLink = $breadcrumbs
      .find('[data-testid="app-breadcrumbs-list-item"]')
      .first()
      .find('[data-testid="app-breadcrumbs-link"]')

    expect($firstBreadcrumbLink.attr('href')).toBe('/deployments')
    expect($firstBreadcrumbLink.attr('class')).toBe('app-breadcrumbs__link')
  })

  test('Last breadcrumb should not be a link', () => {
    const $lastBreadcrumb = $breadcrumbs
      .find('[data-testid="app-breadcrumbs-list-item"]')
      .last()

    expect($lastBreadcrumb.html()).not.toContain(
      `class="app-breadcrumbs__link"`
    )
  })
})
