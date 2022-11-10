import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { disableUsersByTenantUseCase } from '.'
import { IDisableUsersByTenantRequestDTO } from './DisableUsersByTenantDTO'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const tenantId = event.pathParameters!.tenantid

  const disableUsersByTenantResponse = await disableUsersByTenantUseCase.execute({ tenantId } as IDisableUsersByTenantRequestDTO)

  return disableUsersByTenantResponse
}
