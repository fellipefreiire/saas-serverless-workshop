import { APIGatewayAuthorizerResultContext, APIGatewayTokenAuthorizerEvent } from "aws-lambda";

export interface ISharedServiceAuthorizerRequestDTO {
  event: APIGatewayTokenAuthorizerEvent,
  context: APIGatewayAuthorizerResultContext
}