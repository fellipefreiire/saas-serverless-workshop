import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { disableUserUseCase } from '.'
import { IDisableUserRequestDTO } from './DisableUserDTO'

const userPoolId = process.env.TENANT_USER_POOL_ID

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const userName = event.pathParameters!.userName

  const response = await disableUserUseCase.execute({ userName } as IDisableUserRequestDTO, userPoolId!)

  return response
}
