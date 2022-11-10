import { IUser } from "./IUser"

export class User implements IUser {
  public tenantId: string | undefined
  public userName: string | undefined
  public userRole: string | undefined
  public email: string | undefined

  public status: string | undefined
  public enabled: boolean | undefined
  public created: Date | undefined
  public modified: Date | undefined

  constructor(
    userName = undefined,
    tenantId = undefined,
    userRole = undefined,
    email = undefined,
    status = undefined,
    enabled = undefined,
    created = undefined,
    modified = undefined
  ) {
    this.userName = userName;
    this.tenantId = tenantId;
    this.userRole = userRole;
    this.email = email;
    this.status = status;
    this.enabled = enabled;
    this.created = created;
    this.modified = modified;
  }
}