const servicesNotificationConfig = {
  basePath: 'services',
  entityLabel: 'Service',
  defaultEventType: 'deploymentfailed',
  breadcrumbRoot: { text: 'Services', href: '/services' },
  views: {
    list: 'services/service/notifications/views/notifications',
    remove: 'services/service/notifications/views/remove',
    update: 'services/service/notifications/views/update',
    test: 'services/service/notifications/views/test'
  }
}

const testSuitesNotificationConfig = {
  basePath: 'test-suites',
  entityLabel: 'Test Suite',
  defaultEventType: 'testfailed',
  breadcrumbRoot: { text: 'Test suites', href: '/test-suites' },
  views: {
    list: 'test-suites/test-suite/notifications/views/notifications',
    remove: 'test-suites/test-suite/notifications/views/remove',
    update: 'test-suites/test-suite/notifications/views/update',
    test: 'test-suites/test-suite/notifications/views/test'
  }
}

export { servicesNotificationConfig, testSuitesNotificationConfig }
