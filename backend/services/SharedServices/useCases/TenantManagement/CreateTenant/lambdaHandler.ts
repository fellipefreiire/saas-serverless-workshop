import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createTenantUseCase } from '.'
import { ICreateTenantDTO } from './CreateTenantDTO'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult | undefined> => {
  const tenantDetails = JSON.parse(event.body!) as ICreateTenantDTO

  const createTenantResponse = await createTenantUseCase.execute(tenantDetails)

  return createTenantResponse
}
