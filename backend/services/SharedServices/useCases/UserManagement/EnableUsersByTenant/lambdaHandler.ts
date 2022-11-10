import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { enableUsersByTenantUseCase } from '.'
import { IEnableUsersByTenantRequestDTO } from './EnableUsersByTenantDTO'

const userPoolId = process.env.TENANT_USER_POOL_ID
const tableTenantUserMap = process.env.TABLE_TENANT_USER_MAPPING

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {

  const tenantId = event.pathParameters!.tenantid

  const enableUsersByTenantResponse = await enableUsersByTenantUseCase.execute({ tenantId } as IEnableUsersByTenantRequestDTO, userPoolId!, tableTenantUserMap!)

  return enableUsersByTenantResponse
}
