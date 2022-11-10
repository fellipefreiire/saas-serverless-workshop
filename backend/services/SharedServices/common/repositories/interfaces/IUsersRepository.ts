import { User } from "../../entities/User"

export interface IUsersRepository {
  findUserByEmail(userEmail: string, tableName: string): Promise<User>
  findUsersByTenantId(tenantId: string, tableName: string): Promise<User[]>
  save(user: User, tableName: string): Promise<void>
  update(
    tenantId: string,
    dataToUpdate: Record<any, any>,
    tableName: string
  ): Promise<Partial<User>>
}