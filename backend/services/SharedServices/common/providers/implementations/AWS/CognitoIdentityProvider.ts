import CognitoIDP, {
  AdminAddUserToGroupCommand,
  AdminEnableUserCommand,
  AdminCreateUserCommand,
  AdminDisableUserCommand,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  CreateGroupCommand,
  ListUsersCommand
} from '@aws-sdk/client-cognito-identity-provider'

import {
  AdminCreateUserAttributes,
  Group,
  IIdentityProvider,
  UpdateUserAttributes
} from './../../interfaces/IIdentityProvider';

import { User } from '../../../entities/User';

export class AWSCognitoIdentityProvider implements IIdentityProvider {
  private cognitoIDPClient: CognitoIdentityProviderClient

  constructor() {
    this.cognitoIDPClient = new CognitoIdentityProviderClient({})
  }

  async adminAddUserToGroup(
    userName: string,
    groupName: string,
    userPoolId: string
  ): Promise<void> {
    const params: CognitoIDP.AdminAddUserToGroupCommandInput = {
      UserPoolId: userPoolId,
      Username: userName,
      GroupName: groupName
    }

    await this.cognitoIDPClient.send(new AdminAddUserToGroupCommand(params))
  }

  async adminCreateUser(
    userName: string,
    userDetails: AdminCreateUserAttributes,
    userPoolId: string
  ) {
    const userAttributes = Object.entries(userDetails).map(([key, value]) => {
      return {
        'Name': key,
        'Value': value
      }
    })

    const params: CognitoIDP.AdminCreateUserCommandInput = {
      UserPoolId: userPoolId,
      Username: userName,
      UserAttributes: userAttributes,
      ForceAliasCreation: true
    }

    await this.cognitoIDPClient.send(new AdminCreateUserCommand(params))
  }

  async adminDisableUser(
    userName: string,
    userPoolId: string
  ): Promise<void> {
    const params: CognitoIDP.AdminDisableUserCommandInput = {
      UserPoolId: userPoolId,
      Username: userName,
    }

    await this.cognitoIDPClient.send(new AdminDisableUserCommand(params))
  }

  async adminEnableUser(
    userName: string | undefined,
    userPoolId: string
  ): Promise<void> {
    const params: CognitoIDP.AdminEnableUserCommandInput = {
      UserPoolId: userPoolId,
      Username: userName,
    }

    await this.cognitoIDPClient.send(new AdminEnableUserCommand(params))
  }

  async adminGetUser(
    userName: string | undefined,
    userPoolId: string
  ): Promise<User> {
    const params: CognitoIDP.AdminGetUserCommandInput = {
      UserPoolId: userPoolId,
      Username: userName
    }

    const { UserAttributes } = await this.cognitoIDPClient.send(
      new AdminGetUserCommand(params)
    )

    const user = new User()

    for (const attr of UserAttributes!) {
      if (attr.Name === 'custom:tenantId') {
        user.tenantId = attr.Value
      }

      if (attr.Name === 'custom:userRole') {
        user.userRole = attr.Value
      }

      if (attr.Name === 'email') {
        user.email = attr.Value
      }
    }

    return user
  }

  async adminUpdateUser(
    userName: string,
    userDetails: UpdateUserAttributes,
    userPoolId: string
  ): Promise<void> {
    const userAttributes = Object.entries(userDetails).map(([key, value]) => {
      return {
        'Name': key,
        'Value': value
      }
    })

    const params: CognitoIDP.AdminUpdateUserAttributesCommandInput = {
      Username: userName,
      UserPoolId: userPoolId,
      UserAttributes: userAttributes
    }

    await this.cognitoIDPClient.send(
      new AdminUpdateUserAttributesCommand(params)
    )
  }

  async createGroup(
    groupName: string,
    groupDescription: string,
    userPoolId: string
  ): Promise<Group> {
    const params: CognitoIDP.CreateGroupCommandInput = {
      GroupName: groupName,
      UserPoolId: userPoolId,
      Description: groupDescription,
      Precedence: 0
    }

    const { Group } = await this.cognitoIDPClient.send(
      new CreateGroupCommand(params)
    )

    const group = {
      groupName: Group?.GroupName!,
      description: Group?.Description!,
      role: Group?.RoleArn!,
      modified: Group?.LastModifiedDate!,
      created: Group?.CreationDate!
    }

    return group
  }

  async listUsers(
    userPoolId: string
  ): Promise<User[]> {
    const params: CognitoIDP.ListUsersCommandInput = {
      UserPoolId: userPoolId
    }

    const { Users } = await this.cognitoIDPClient
      .send(new ListUsersCommand(params))

    const users = [] as User[]

    const numOfUsers = Users!.length

    if (numOfUsers > 0) {
      for (const user of Users!) {
        const userInfo = new User()
        for (const attr of user.Attributes!) {
          if (attr.Name === 'custom:tenantId') {
            userInfo.tenantId = attr.Value
          }

          if (attr.Name === 'custom:userRole') {
            userInfo.userRole = attr.Value
          }

          if (attr.Name === 'email') {
            userInfo.email = attr.Value
          }

          userInfo.enabled = user.Enabled
          userInfo.created = user.UserCreateDate
          userInfo.modified = user.UserLastModifiedDate
          userInfo.status = user.UserStatus
          userInfo.userName = user.Username
          users.push(userInfo)
        }
      }
    }

    return users
  }

}