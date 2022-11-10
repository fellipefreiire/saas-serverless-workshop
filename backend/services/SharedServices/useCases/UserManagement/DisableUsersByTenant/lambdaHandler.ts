import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { disableUsersByTenantUseCase } from '.'
import { IDisableUsersByTenantRequestDTO } from './DisableUsersByTenantDTO'

const userPoolId = process.env.TENANT_USER_POOL_ID
const tableTenantUserMap = process.env.TABLE_TENANT_USER_MAPPING

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const tenantId = event.pathParameters!.tenantid

  const disableUsersByTenantResponse = await disableUsersByTenantUseCase.execute({ tenantId } as IDisableUsersByTenantRequestDTO, userPoolId!, tableTenantUserMap!)

  return disableUsersByTenantResponse
}
