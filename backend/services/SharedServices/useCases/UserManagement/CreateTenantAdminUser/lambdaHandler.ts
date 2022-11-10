import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createTenantAdminUserUseCase } from '.'
import { ICreateTenantAdminUserRequestDTO } from './CreateTenantAdminUserDTO'

const userPoolId = process.env.TENANT_USER_POOL_ID
const tableTenantUserMap = process.env.TABLE_TENANT_USER_MAPPING

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const tenantDetails = JSON
    .parse(event.body!) as ICreateTenantAdminUserRequestDTO

  const response = await createTenantAdminUserUseCase.execute(
    tenantDetails, userPoolId!, tableTenantUserMap!
  )

  return response
}
