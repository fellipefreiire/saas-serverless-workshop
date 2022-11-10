import { APIGatewayProxyEvent } from 'aws-lambda'
import { updateTenantUseCase } from '.'
import { IUpdateTenantDTO } from './UpdateTenantDTO'

export const handler = async (event: APIGatewayProxyEvent) => {
  const tenantDetails = JSON.parse(event.body!) as Record<any, any>
  const tenantId = event.pathParameters!.tenantId

  const updateTenantResponse = await updateTenantUseCase.execute({ tenantId } as IUpdateTenantDTO, tenantDetails)

  return updateTenantResponse
}
