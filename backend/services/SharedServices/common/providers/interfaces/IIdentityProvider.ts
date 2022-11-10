import { User } from '/opt/nodejs/entities/User';

//TODO Enhance provider

export interface IIdentityProvider {
  adminAddUserToGroup(
    userName: string, groupName: string, userPoolId: string
  ): Promise<void>
  adminCreateUser(
    userName: string, userAttributes: AdminCreateUserAttributes, userPoolId: string
  ): Promise<void>
  adminDisableUser(userName: string, userPoolId: string): Promise<void>
  adminEnableUser(userName: string, userPoolId: string): Promise<void>
  adminGetUser(userName: string, userPoolId: string): Promise<User>
  adminUpdateUser(
    userName: string | undefined, userAttributes: UpdateUserAttributes, userPoolId: string
  ): Promise<void>
  createGroup(
    groupName: string, groupDescription: string, userPoolId: string
  ): Promise<Group>
  listUsers(userPoolId: string): Promise<User[]>
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