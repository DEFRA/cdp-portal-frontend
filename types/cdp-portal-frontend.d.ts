import type { RequestOptions, Response } from 'node-fetch'

declare module '@hapi/hapi' {
  interface Request {
    isXhr: () => boolean
    authedFetcher: (url: string, options?: RequestOptions) => Promise<Response>
    getUserSession: () => Promise<UserSession>
    dropUserSession: () => void
    userIsTeamMember: (scope: string) => Promise<boolean>
    userIsMemberOfATeam: (scopes: string[]) => Promise<boolean>
    userIsServiceOwner: (scopes: string[]) => Promise<boolean>
    routeLookup: (
      id: string,
      options?: {
        query: Record<string, string>
        params: Record<string, string>
      }
    ) => string
  }
}
