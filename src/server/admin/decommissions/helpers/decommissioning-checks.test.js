import { isPostgresDeleteProtectionEnabled } from './decommissioning-checks.js'

describe('#isPostgresDeleteProtectionEnabled', () => {
  it('should return false if no environments have databases with protection enabled', () => {
    const entity = {
      environments: {
        dev: {
          sql_database: {
            deletion_protection: false
          }
        },
        test: {
          sql_database: {
            deletion_protection: false
          }
        }
      }
    }
    expect(isPostgresDeleteProtectionEnabled(entity)).toBe(false)
  })

  it('should return true if any environment has a database with protection enabled', () => {
    const entity = {
      environments: {
        dev: {
          sql_database: {
            deletion_protection: true
          }
        },
        test: {}
      }
    }
    expect(isPostgresDeleteProtectionEnabled(entity)).toBe(true)
  })

  it('should return true if more than one environment has a database with protection enabled', () => {
    const entity = {
      environments: {
        dev: {
          sql_database: {
            deletion_protection: true
          }
        },
        test: {
          sql_database: {
            deletion_protection: true
          }
        }
      }
    }
    expect(isPostgresDeleteProtectionEnabled(entity)).toBe(true)
  })
})
