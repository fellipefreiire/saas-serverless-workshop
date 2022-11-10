import { IUserRolesProvider } from "../../interfaces/IUserRolesProvider"

export class UserRolesProvider implements IUserRolesProvider {
  public SYSTEM_ADMIN: string
  public CUSTOMER_SUPPORT: string
  public TENANT_ADMIN: string
  public TENANT_USER: string

  constructor(
    SYSTEM_ADMIN = "SystemAdmin",
    CUSTOMER_SUPPORT = "CustomerSupport",
    TENANT_ADMIN = "TenantAdmin",
    TENANT_USER = "TenantUser",
  ) {
    this.SYSTEM_ADMIN = SYSTEM_ADMIN;
    this.CUSTOMER_SUPPORT = CUSTOMER_SUPPORT;
    this.TENANT_ADMIN = TENANT_ADMIN;
    this.TENANT_USER = TENANT_USER;
  }
}