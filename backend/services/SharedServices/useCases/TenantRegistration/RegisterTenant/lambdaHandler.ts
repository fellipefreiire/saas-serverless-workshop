import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { v4 as uuidv4 } from 'uuid'
import { registerTenantUseCase } from '.'

const createTenantAdminUserResourcePath = process.env.CREATE_TENANT_ADMIN_USER_RESOURCE_PATH
const createTenantResourcePath = process.env.CREATE_TENANT_RESOURCE_PATH
const region = process.env.AWS_REGION

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const tenantId = uuidv4()
  const tenantDetails = JSON.parse(event.body!)
  tenantDetails.tenantId = tenantId

  const stageName = event.requestContext.stage
  const host = event.headers.Host

  const registerTenantResponse = await registerTenantUseCase.execute(
    tenantDetails,
    host!,
    stageName,
    createTenantAdminUserResourcePath!,
    createTenantResourcePath!,
    region!
  )

  return registerTenantResponse
}
