import { APIGatewayAuthorizerResultContext, APIGatewayProxyResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda'
import { tenantAuthorizerUseCase } from '.'

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: APIGatewayAuthorizerResultContext
): Promise<APIGatewayProxyResult | undefined> => {

  const authResponse = await tenantAuthorizerUseCase.execute({ event, context })

  return authResponse
}
