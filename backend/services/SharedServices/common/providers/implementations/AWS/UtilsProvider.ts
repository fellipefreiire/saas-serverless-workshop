import { Sha256 } from '@aws-crypto/sha256-js';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { SignatureV4 } from '@aws-sdk/signature-v4';

import { APIGatewayProxyResult } from 'aws-lambda';

import { URL } from 'url';

import { IUtilsProvider, StatusCode } from "../../interfaces/IUtilsProvider";

export class AWSUtilsProvider implements IUtilsProvider {
  statusCode: StatusCode

  constructor(
    statusCode = {
      SUCCESS: 200,
      UN_AUTHORIZED: 401,
      NOT_FOUND: 404,
    }
  ) {
    this.statusCode = statusCode
  }

  createSuccessResponse(message: any): APIGatewayProxyResult {
    return {
      'statusCode': this.statusCode.SUCCESS,
      'headers': {
        'Access-Control-Allow-Headers': 'Content-Type, Origin, X-Requested-With, Accept, Authorization, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Allow-Origin',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
      },
      'body': JSON.stringify({
        'message': message
      })
    }
  }

  generateResponse(inputObject: Record<any, any>): APIGatewayProxyResult {
    return {
      'statusCode': this.statusCode.SUCCESS,
      'headers': {
        'Access-Control-Allow-Headers': 'Content-Type, Origin, X-Requested-With, Accept, Authorization, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Allow-Origin',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
      },
      'body': JSON.stringify(inputObject)
    }
  }

  async getAuth(
    apiUrl: string,
    region: string,
    method: string,
    body?: Record<any, any>
  ): Promise<any> {
    const url = new URL(apiUrl)

    const request = new HttpRequest({
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        host: url.host,
      },
      hostname: url.hostname,
      method,
      path: url.pathname,
      body: JSON.stringify(body),
    })

    const sigv4 = new SignatureV4({
      service: 'execute-api',
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN!,
      },
      sha256: Sha256,
    });

    const signedRequest = await sigv4.sign(request);

    return signedRequest
  }
}