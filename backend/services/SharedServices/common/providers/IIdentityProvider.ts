import { User } from '/opt/nodejs/entities/User';

export interface IIdentityProvider {
  createGroup(
    groupName: string,
    groupDescription: string,
  ): Promise<Group>
  adminCreateUser(
    userName: string,
    userAttributes: AdminCreateUserAttributes,
  ): Promise<void>
  adminAddUserToGroup(
    userName: string,
    groupName: string
  ): Promise<void>
  adminUpdateUser(
    userName: string | undefined,
    userAttributes: UpdateUserAttributes
  ): Promise<void>
  adminDisableUser(
    userName: string
  ): Promise<void>
  adminEnableUser(
    userName: string
  ): Promise<void>
  adminGetUser(
    userName: string
  ): Promise<User>
  listUsers(): Promise<User[]>
}

export interface Group {
  groupName: string;
  description: string;
  role: string;
  modified: Date;
  created: Date;
}

export interface AdminCreateUserAttributes {
  email: string,
  'custom:tenantId': string,
  email_verified?: string,
  'custom:userRole'?: string
}

export interface UpdateUserAttributes {
  email: string
  'custom:userRole': string
}