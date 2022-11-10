import { Tenant } from "../entities/Tenant";

export interface ITenantsRepository {
  findTenantById(tenantId: string): Promise<Tenant>
  findTenantByEmail(tenantEmail: string): Promise<Tenant>
  save(tenant: Tenant): Promise<void>
  findAllTenants(): Promise<Record<string, any>[]>
  update(
    tenantId: string,
    dataToUpdate: Record<any, any>,
  ): Promise<Partial<Tenant>>
}