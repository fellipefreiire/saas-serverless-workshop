import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createTenantUseCase } from '.'
import { ICreateTenantDTO } from './CreateTenantDTO'

const tableTenantDetails = process.env.TABLE_TENANT_DETAILS

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult | undefined> => {
  const tenantDetails = JSON.parse(event.body!) as ICreateTenantDTO

  const createTenantResponse = await createTenantUseCase
    .execute(tenantDetails, tableTenantDetails!)

  return createTenantResponse
}
