export const ACCOUNT_QUERY_KEYS = {
  all: ['account'] as const,
  profile: () => [...ACCOUNT_QUERY_KEYS.all, 'profile'] as const,
  byId: (id: number) => [...ACCOUNT_QUERY_KEYS.all, id] as const,
}
