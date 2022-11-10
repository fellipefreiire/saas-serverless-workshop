import { User } from "/opt/nodejs/entities/User";

export interface IUsersRepository {
  findUserByEmail(userEmail: string): Promise<User>
  save(user: User): Promise<void>
  findUsersByTenantId(tenantId: string): Promise<User[]>
  update(
    tenantId: string,
    dataToUpdate: Record<any, any>,
  ): Promise<Partial<User>>
}