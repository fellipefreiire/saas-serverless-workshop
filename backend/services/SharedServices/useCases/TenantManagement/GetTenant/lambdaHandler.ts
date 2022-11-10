import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getTenantUseCase } from '.'
import { IGetTenantDTO } from './GetTenantDTO'

const tableTenantDetails = process.env.TABLE_TENANT_DETAILS

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult | undefined> => {
  const tenantId = event.pathParameters!.tenantId

  const getTenantDetailResponse = await getTenantUseCase
    .execute({ tenantId } as IGetTenantDTO, tableTenantDetails!)

  return getTenantDetailResponse
}
