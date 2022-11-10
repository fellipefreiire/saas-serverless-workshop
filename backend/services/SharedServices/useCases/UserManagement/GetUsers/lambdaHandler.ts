import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUsersUseCase } from '.'

const userPoolId = process.env.TENANT_USER_POOL_ID

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const users = await getUsersUseCase.execute(userPoolId!)

  return users
}

