import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUsersUseCase } from '.'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const users = await getUsersUseCase.execute()

  return users
}

