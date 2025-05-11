import { S3Client } from '@aws-sdk/client-s3'
import { Policy } from '@hapi/catbox'

import type { RequestOptions, Response } from 'node-fetch'

declare module '@hapi/hapi' {
  interface Request {
    authedFetchJson: (
      url: string,
      options?: RequestOptions
    ) => Promise<Response>
    dropUserSession: () => void
    getUserSession: () => Promise<UserSession>
    isXhr: () => boolean
    routeLookup: (
      id: string,
      options?: {
        query: Record<string, string>
        params: Record<string, string>
      }
    ) => string
    s3Client: S3Client
    userIsMemberOfATeam: (scopes: string[]) => Promise<boolean>
    userIsServiceOwner: (scopes: string[]) => Promise<boolean>
    userIsTeamMember: (scope: string) => Promise<boolean>
    getTraceId: () => string | undefined
    sessionCookie: {
      h: ResponseToolkit
      set: (session: object) => void
      clear: () => void
      ttl: (msecs: number) => void
    }
    session: Policy
    featureToggles: Policy
    hasScope: (scope: string) => boolean
  }

  interface Server {
    s3Client: S3Client
    secureContext: SecureContext
    getTraceId: () => string | undefined
    session: Policy
    featureToggles: Policy
  }
}
