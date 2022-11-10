import { APIGatewayAuthorizerResultContext, APIGatewayTokenAuthorizerEvent } from "aws-lambda";

export interface ITenantAuthorizerRequestDTO {
  event: APIGatewayTokenAuthorizerEvent,
  context: APIGatewayAuthorizerResultContext
}