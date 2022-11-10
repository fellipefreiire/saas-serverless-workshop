import { APIGatewayProxyResult } from 'aws-lambda'
import { getTenantsUseCase } from '.'

const tableTenantDetails = process.env.TABLE_TENANT_DETAILS

export const handler = async (): Promise<APIGatewayProxyResult | undefined> => {
  const getTenantsResponse = await getTenantsUseCase
    .execute(tableTenantDetails!)

  return getTenantsResponse
}
