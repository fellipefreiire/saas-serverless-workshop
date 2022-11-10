import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { disableUserUseCase } from '.'
import { IDisableUserRequestDTO } from './DisableUserDTO'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const userName = event.pathParameters!.userName

  const response = await disableUserUseCase.execute({ userName } as IDisableUserRequestDTO)

  return response
}
