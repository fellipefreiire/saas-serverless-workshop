import { AdminCreateUserAttributes, Group, IIdentityProvider, UpdateUserAttributes } from './../../IIdentityProvider';
import CognitoIDP, { CognitoIdentityProviderClient, AdminCreateUserCommand, CreateGroupCommand, AdminAddUserToGroupCommand, AdminDisableUserCommand, AdminEnableUserCommand, AdminGetUserCommand, ListUsersCommand, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider'
import { User } from '../../../entities/User';

export class CognitoIdentityProvider implements IIdentityProvider {
  private cognitoIDPClient: CognitoIdentityProviderClient
  private userPoolId: string

  constructor(
    userPoolId: string
  ) {
    this.cognitoIDPClient = new CognitoIdentityProviderClient({})
    this.userPoolId = userPoolId
  }

  async createGroup(
    groupName: string,
    groupDescription: string
  ): Promise<Group> {
    const params: CognitoIDP.CreateGroupCommandInput = {
      GroupName: groupName,
      UserPoolId: this.userPoolId,
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

  async adminCreateUser(
    userName: string,
    userDetails: AdminCreateUserAttributes
  ) {
    const userAttributes = Object.entries(userDetails).map(([key, value]) => {
      return {
        'Name': key,
        'Value': value
      }
    })

    const params: CognitoIDP.AdminCreateUserCommandInput = {
      UserPoolId: this.userPoolId,
      Username: userName,
      UserAttributes: userAttributes,
      ForceAliasCreation: true
    }

    await this.cognitoIDPClient.send(new AdminCreateUserCommand(params))
  }

  async adminAddUserToGroup(
    userName: string,
    groupName: string
  ): Promise<void> {
    const params: CognitoIDP.AdminAddUserToGroupCommandInput = {
      UserPoolId: this.userPoolId,
      Username: userName,
      GroupName: groupName
    }

    await this.cognitoIDPClient.send(new AdminAddUserToGroupCommand(params))
  }

  async adminDisableUser(
    userName: string
  ): Promise<void> {
    const params: CognitoIDP.AdminDisableUserCommandInput = {
      UserPoolId: this.userPoolId,
      Username: userName,
    }

    await this.cognitoIDPClient.send(new AdminDisableUserCommand(params))
  }

  async adminEnableUser(
    userName: string | undefined
  ): Promise<void> {
    const params: CognitoIDP.AdminEnableUserCommandInput = {
      UserPoolId: this.userPoolId,
      Username: userName,
    }

    await this.cognitoIDPClient.send(new AdminEnableUserCommand(params))
  }

  async adminGetUser(
    userName: string | undefined
  ): Promise<User> {
    const params: CognitoIDP.AdminGetUserCommandInput = {
      UserPoolId: this.userPoolId,
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

  async listUsers(): Promise<User[]> {
    const params: CognitoIDP.ListUsersCommandInput = {
      UserPoolId: this.userPoolId
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

  async adminUpdateUser(
    userName: string,
    userDetails: UpdateUserAttributes
  ): Promise<void> {
    const userAttributes = Object.entries(userDetails).map(([key, value]) => {
      return {
        'Name': key,
        'Value': value
      }
    })

    const params: CognitoIDP.AdminUpdateUserAttributesCommandInput = {
      Username: userName,
      UserPoolId: this.userPoolId,
      UserAttributes: userAttributes
    }

    await this.cognitoIDPClient.send(
      new AdminUpdateUserAttributesCommand(params)
    )
  }
}