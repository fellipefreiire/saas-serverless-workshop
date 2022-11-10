import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { updateUserUseCase } from '.'
import { IUpdateUserParamDTO, IUpdateUserRequestDTO } from './UpdateUserDTO'

const userPoolId = process.env.TENANT_USER_POOL_ID

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const userDetails = JSON.parse(event.body!) as IUpdateUserRequestDTO
  const userName = event.pathParameters!.userName

  const response = await updateUserUseCase
    .execute({ userName } as IUpdateUserParamDTO, userDetails, userPoolId!)

  return response
}
