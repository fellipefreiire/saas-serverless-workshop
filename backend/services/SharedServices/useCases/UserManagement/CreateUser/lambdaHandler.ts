import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createUserUseCase } from '.'
import { ICreateUserRequestDTO } from './CreateUserDTO'

const userPoolId = process.env.TENANT_USER_POOL_ID
const tableTenantUserMap = process.env.TABLE_TENANT_USER_MAPPING

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const userDetails = JSON.parse(event.body!) as ICreateUserRequestDTO

  const response = await createUserUseCase.execute(userDetails, userPoolId!, tableTenantUserMap!)

  return response
}
