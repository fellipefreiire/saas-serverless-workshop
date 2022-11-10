import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createUserUseCase } from '.'
import { ICreateUserRequestDTO } from './CreateUserDTO'

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | undefined> => {
  const userDetails = JSON.parse(event.body!) as ICreateUserRequestDTO

  const response = await createUserUseCase.execute(userDetails)

  return response
}
