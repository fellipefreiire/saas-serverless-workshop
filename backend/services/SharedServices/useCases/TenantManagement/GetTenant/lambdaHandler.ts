import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getTenantUseCase } from '.'
import { IGetTenantDTO } from './GetTenantDTO'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult | undefined> => {
  const tenantId = event.pathParameters!.tenantId

  const getTenantDetailResponse = await getTenantUseCase
    .execute({ tenantId } as IGetTenantDTO)

  return getTenantDetailResponse
}
