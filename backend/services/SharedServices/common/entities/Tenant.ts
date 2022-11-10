import { ITenant } from "./interfaces/ITenant"

export class Tenant implements ITenant {
  public tenantName: string | undefined
  public tenantAddress: string | undefined
  public tenantEmail: string | undefined
  public tenantPhone: string | undefined
  public tenantTier: string | undefined
  public isActive: boolean | undefined

  constructor(
    tenantName = undefined,
    tenantAddress = undefined,
    tenantEmail = undefined,
    tenantPhone = undefined,
    tenantTier = undefined,
    isActive = undefined
  ) {
    this.tenantName = tenantName;
    this.tenantAddress = tenantAddress;
    this.tenantEmail = tenantEmail;
    this.tenantPhone = tenantPhone;
    this.tenantTier = tenantTier;
    this.isActive = isActive
  }
}