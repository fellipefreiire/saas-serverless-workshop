import { Tenant } from "../../entities/Tenant"

export interface ITenantsRepository {
  findAllTenants(tableName: string): Promise<Record<string, any>[]>
  findTenantByEmail(tenantEmail: string, tableName: string): Promise<Tenant>
  findTenantById(tenantId: string, tableName: string): Promise<Tenant>
  save(tenant: Tenant, tableName: string): Promise<void>
  update(
    tenantId: string,
    dataToUpdate: Record<any, any>,
    tableName: string
  ): Promise<Partial<Tenant>>
}