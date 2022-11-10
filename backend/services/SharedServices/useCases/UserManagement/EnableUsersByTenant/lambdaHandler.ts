import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { enableUsersByTenantUseCase } from '.'
import { IEnableUsersByTenantRequestDTO } from './EnableUsersByTenantDTO'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {

  const tenantId = event.pathParameters!.tenantid

  const enableUsersByTenantResponse = await enableUsersByTenantUseCase.execute({ tenantId } as IEnableUsersByTenantRequestDTO)

  return enableUsersByTenantResponse
}
