export interface IAuthManagerProvider {
  isSaaSProvider(userRole: string): boolean
  isSystemAdmin(userRole: string): boolean
  isTenantAdmin(userRole: string): boolean
  isTenantUser(userRole: string): boolean
}
