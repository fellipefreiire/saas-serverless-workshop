import { APIGatewayAuthorizerResultContext, APIGatewayProxyResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda'
import { sharedServiceAuthorizerUseCase } from '.'

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: APIGatewayAuthorizerResultContext
): Promise<APIGatewayProxyResult | undefined> => {

  const authResponse = await sharedServiceAuthorizerUseCase.execute({ event, context })

  return authResponse
}
