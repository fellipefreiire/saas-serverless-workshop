import { APIGatewayProxyResult } from 'aws-lambda'
import { getTenantsUseCase } from '.'

export const handler = async (): Promise<APIGatewayProxyResult | undefined> => {
  const getTenantsResponse = await getTenantsUseCase.execute()

  return getTenantsResponse
}
