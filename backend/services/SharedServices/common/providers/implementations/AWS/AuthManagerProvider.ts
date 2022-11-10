import { IAuthManagerProvider } from "../../interfaces/IAuthManagerProvider";
import { UserRolesProvider } from "../common/UserRolesProvider";

export class AWSAuthManagerProvider implements IAuthManagerProvider {
  private userRoles: UserRolesProvider

  constructor() {
    this.userRoles = new UserRolesProvider()
  }

  isTenantAdmin(userRole: string): boolean {
    if (userRole == this.userRoles.TENANT_ADMIN) {
      return true
    } else {
      return false
    }
  }
  isSystemAdmin(userRole: string): boolean {
    if (userRole == this.userRoles.SYSTEM_ADMIN) {
      return true
    } else {
      return false
    }
  }
  isSaaSProvider(userRole: string): boolean {
    if (userRole == this.userRoles.SYSTEM_ADMIN || userRole === this.userRoles.CUSTOMER_SUPPORT) {
      return true
    } else {
      return false
    }
  }
  isTenantUser(userRole: string): boolean {
    if (userRole == this.userRoles.TENANT_USER) {
      return true
    } else {
      return false
    }
  }
}