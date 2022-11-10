import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deactivateTenantUseCase } from '.'

const region = process.env.AWS_REGION
const tableTenantDetails = process.env.TABLE_TENANT_DETAILS

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult | undefined> => {
  const disableUsersPath = process.env.DISABLE_USERS_BY_TENANT
  const stageName = event.requestContext.stage
  const host = event.headers.Host
  const tenantId = event.pathParameters!.tenantId

  const deactivateTenantResponse = await deactivateTenantUseCase.execute({
    tenantId: tenantId!,
    disableUsersPath: disableUsersPath!,
    stageName,
    host: host!,
    region: region!
  }, tableTenantDetails!)

  return deactivateTenantResponse
}
