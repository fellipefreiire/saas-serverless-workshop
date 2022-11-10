import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import DynamoDBDocument, { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { Tenant } from "../../../entities/Tenant"
import { ITenantsRepository } from "../../ITenantsRepository"

//TODO CHECK FUNCTIONS RETURN

export class DynamoDBTenantsRepository implements ITenantsRepository {
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
  async findTenantById(tenantId: string): Promise<Tenant> {
    const params: DynamoDBDocument.GetCommandInput = {
      TableName: this.table,
      Key: { tenantId }
    }

    const { Item } = await this.docClient
      .send(new GetCommand(params))

    return Item as Tenant
  }

  async findTenantByEmail(tenantEmail: string): Promise<Tenant> {
    const params: DynamoDBDocument.GetCommandInput = {
      TableName: this.table,
      Key: { tenantEmail }
    }

    const { Item } = await this.docClient
      .send(new GetCommand(params))

    return Item as Tenant
  }

  async save(tenant: Tenant | Tenant): Promise<void> {
    const params: DynamoDBDocument.PutCommandInput = {
      TableName: this.table,
      Item: tenant
    }

    await this.docClient.send(new PutCommand(params))
  }

  async findAllTenants(): Promise<Record<string, any>[]> {
    const params: DynamoDBDocument.ScanCommandInput = {
      TableName: this.table,
    }

    const { Items } = await this.docClient
      .send(new ScanCommand(params))

    return Items!
  }

  async update(
    id: string,
    objToUpdate: any,
  ): Promise<Partial<Tenant>> {
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