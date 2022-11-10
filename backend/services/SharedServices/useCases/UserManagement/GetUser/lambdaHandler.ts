import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserUseCase } from '.'
import { IGetUserRequestDTO } from './GetUserDTO'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const userName = event.pathParameters!.username

  const userInfo = await getUserUseCase.execute({ userName } as IGetUserRequestDTO)

  return userInfo
}
