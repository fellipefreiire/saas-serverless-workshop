import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createTenantAdminUserUseCase } from '.'
import { ICreateTenantAdminUserRequestDTO } from './CreateTenantAdminUserDTO'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const tenantDetails = JSON
    .parse(event.body!) as ICreateTenantAdminUserRequestDTO

  const response = await createTenantAdminUserUseCase.execute(tenantDetails)

  return response
}
