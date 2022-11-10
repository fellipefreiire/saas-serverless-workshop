import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { v4 as uuidv4 } from 'uuid'
import { registerTenantUseCase } from '.'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const tenantId = uuidv4()
  const tenantDetails = JSON.parse(event.body!)
  tenantDetails.tenantId = tenantId

  const stageName = event.requestContext.stage
  const host = event.headers.Host

  const registerTenantResponse = await registerTenantUseCase.execute(tenantDetails, host!, stageName)

  return registerTenantResponse
}
