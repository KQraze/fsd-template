export const ACCOUNT_QUERY_KEYS = {
  root: ['account'] as const,
  profile: () => [...ACCOUNT_QUERY_KEYS.root, 'profile'] as const,
  byId: (id: number) => [...ACCOUNT_QUERY_KEYS.root, id] as const,
}
