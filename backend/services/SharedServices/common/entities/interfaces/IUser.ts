export interface IUser {
  userName: string | undefined
  tenantId: string | undefined
  userRole: string | undefined
  email: string | undefined
  status: string | undefined
  enabled: boolean | undefined
  created: Date | undefined
  modified: Date | undefined
}