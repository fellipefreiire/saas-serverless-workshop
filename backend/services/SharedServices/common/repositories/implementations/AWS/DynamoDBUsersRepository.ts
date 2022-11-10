import { User } from "/opt/nodejs/entities/User"
import { IUsersRepository } from "../../IUsersRepository"
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import DynamoDBDocument, { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

//TODO CHECK FUNCTIONS RETURN

export class DynamoDBUsersRepository implements IUsersRepository {
  table: string
  private docClient: DynamoDBDocument.DynamoDBDocumentClient
  private dDBClient: DynamoDBClient

  constructor(table: string) {
    this.dDBClient = new DynamoDBClient({})
    this.docClient = DynamoDBDocumentClient.from(this.dDBClient, {
      marshallOptions: {
        convertClassInstanceToMap: true,
        removeUndefinedValues: true,
      }
    })
    this.table = table
  }
  async findUserByEmail(userEmail: string): Promise<User> {
    const params: DynamoDBDocument.GetCommandInput = {
      TableName: this.table,
      Key: { userEmail }
    }

    const { Item } = await this.docClient
      .send(new GetCommand(params))

    return Item as User
  }

  async save(user: User): Promise<void> {
    const params: DynamoDBDocument.PutCommandInput = {
      TableName: this.table,
      Item: user
    }

    await this.docClient.send(new PutCommand(params))
  }

  async findUsersByTenantId(
    tenantId: string
  ) {
    const keyConditionExpression = 'tenantId = :tenantId'
    const expressionAttributeValues = {
      ':tenantId': tenantId
    }

    const params: DynamoDBDocument.QueryCommandInput = {
      TableName: this.table,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues
    }

    const { Items } = await this.docClient
      .send(new QueryCommand(params))

    return Items as User[]
  }

  async update(
    id: string,
    objToUpdate: any,
  ): Promise<Partial<User>> {
    const objKeys = Object.keys(objToUpdate)
    const params: DynamoDBDocument.UpdateCommandInput = {
      TableName: this.table,
      Key: { id },
      UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
      ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
        ...acc,
        [`#key${index}`]: key,
      }), {}),
      ExpressionAttributeValues: objKeys.reduce((acc, key, index) => ({
        ...acc,
        [`:value${index}`]: objToUpdate[key],
      }), {}),
      ReturnValues: 'ALL_NEW'
    }

    const { Attributes } = await this.docClient
      .send(new UpdateCommand(params))

    return Attributes!
  }
}