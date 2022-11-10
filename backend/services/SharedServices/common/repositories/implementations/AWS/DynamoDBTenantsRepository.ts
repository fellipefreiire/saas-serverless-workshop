import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import DynamoDBDocument, {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb'

import { ITenantsRepository } from "../../interfaces/ITenantsRepository"
import { Tenant } from "../../../entities/Tenant"

//TODO CHECK FUNCTIONS RETURN

export class DynamoDBTenantsRepository implements ITenantsRepository {
  private docClient: DynamoDBDocument.DynamoDBDocumentClient
  private dDBClient: DynamoDBClient

  constructor() {
    this.dDBClient = new DynamoDBClient({})
    this.docClient = DynamoDBDocumentClient.from(this.dDBClient, {
      marshallOptions: {
        convertClassInstanceToMap: true,
        removeUndefinedValues: true,
      }
    })
  }
  async findTenantById(
    tenantId: string,
    tableName: string
  ): Promise<Tenant> {
    const params: DynamoDBDocument.GetCommandInput = {
      TableName: tableName,
      Key: { tenantId }
    }

    const { Item } = await this.docClient
      .send(new GetCommand(params))

    return Item as Tenant
  }

  async findTenantByEmail(
    tenantEmail: string,
    tableName: string
  ): Promise<Tenant> {
    const params: DynamoDBDocument.GetCommandInput = {
      TableName: tableName,
      Key: { tenantEmail }
    }

    const { Item } = await this.docClient
      .send(new GetCommand(params))

    return Item as Tenant
  }

  async save(
    tenant: Tenant,
    tableName: string
  ): Promise<void> {
    const params: DynamoDBDocument.PutCommandInput = {
      TableName: tableName,
      Item: tenant
    }

    await this.docClient.send(new PutCommand(params))
  }

  async findAllTenants(
    tableName: string
  ): Promise<Record<string, any>[]> {
    const params: DynamoDBDocument.ScanCommandInput = {
      TableName: tableName,
    }

    const { Items } = await this.docClient
      .send(new ScanCommand(params))

    return Items!
  }

  async update(
    id: string,
    objToUpdate: any,
    tableName: string
  ): Promise<Partial<Tenant>> {
    const objKeys = Object.keys(objToUpdate)
    const params: DynamoDBDocument.UpdateCommandInput = {
      TableName: tableName,
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