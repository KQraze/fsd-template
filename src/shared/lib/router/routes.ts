export const Routes = {
  home: '/',
  login: '/login',
} as const

export type RouteName = keyof typeof Routes
