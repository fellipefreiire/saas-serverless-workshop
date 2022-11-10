import axios from 'axios'
import jose from 'jose'

import { ITenantAuthorizerRequestDTO } from './TenantAuthorizerDTO';

import { IAuthPolicyProvider } from '/opt/nodejs/providers/interfaces/IAuthPolicyProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider';

const region = process.env.AWS_REGION
const userPoolOperationUser = process.env.OPERATION_USERS_USER_POOL
const appClientOperationUser = process.env.OPERATION_USERS_APP_CLIENT

export class TenantAuthorizerUseCase {
  constructor(
    private authPolicyProvider: IAuthPolicyProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute(
    {
      event,
      context
    }: ITenantAuthorizerRequestDTO
  ) {
    try {
      this.loggerProvider.info('TENANT AUTHORIZER INIT')
      const token = event.authorizationToken.split(" ")

      if (token[0] !== 'Bearer') {
        throw new Error('Authorization header should have a format bearer <JWT> Token')
      }

      const jwtBearerToken = token[1]
      this.loggerProvider.info('Method ARN: ' + event.methodArn)

      const unauthorizedClaims = jose.decodeJwt(jwtBearerToken)
      this.loggerProvider.info(unauthorizedClaims)

      const userpoolId = userPoolOperationUser
      const appClientId = appClientOperationUser

      const keysUrl =
        `https://cognito-idp.${region}.amazonaws.com/${userpoolId}/.well-known/jwks.json`

      const response = await axios.get(keysUrl)

      const keys: jose.JWK[] = response.data

      const validJwt = await this.validateJWT(jwtBearerToken, appClientId, keys)

      let principalId: string
      let userName: string
      let tenantId: string
      if (validJwt === false) {
        this.loggerProvider.error('Unauthorized')
        throw new Error('Unauthorized')
      } else {
        this.loggerProvider.info(validJwt)
        principalId = validJwt.sub!
        userName = validJwt['cognito:username'] as string
        tenantId = validJwt['custom:tenantId'] as string
      }

      const tmp = event.methodArn.split(':')
      const apigatewayArnTmp = tmp[5].split('/')
      const awsAccountId = tmp[4]

      this.authPolicyProvider.principalId = principalId!
      this.authPolicyProvider.awsAccountId = awsAccountId
      this.authPolicyProvider.restApiId = apigatewayArnTmp[0]
      this.authPolicyProvider.region = tmp[3]
      this.authPolicyProvider.stage = apigatewayArnTmp[1]

      this.authPolicyProvider.allowAllMethods()

      const authResponse = this.authPolicyProvider.build()

      context = {
        'userName': userName,
        'tenantId': tenantId
      }

      authResponse['context'] = context

      return authResponse
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.loggerProvider.error(err.message)
        this.loggerProvider.error(err.stack)
      } else {
        this.loggerProvider.error(err)
      }
    }
  }

  private async validateJWT(
    token: any,
    appClientId: any,
    keys: jose.JWK[]
  ) {
    // Get the kid from the headers prior to verification
    // const headers = jwt.decode(token)
    const headers = jose.decodeProtectedHeader(token)
    const kid = headers.kid

    // search for the kid in the downloaded public keys
    let keyIndex = -1

    for (let i = 0; i < keys.length; i++) {
      if (kid === keys[i].kid) {
        keyIndex = i
        break
      }
    }

    if (keyIndex === -1) {
      this.loggerProvider.info('Public key not found in jwks.json')
      return false
    }

    // construct the public key
    const publicKey = await jose.importJWK(keys[keyIndex])

    // get the last two sections of the token
    // message and signature (encoded in bas64)
    // const message = String(token).split('.').slice(0, -1).join('.')
    const signature = String(token).split('.', 1).slice(0, -1).join('.')

    // decode the signature
    // const decodedSignature = jose.decodeJwt(encodedSignature)

    // verify the signature
    if (!jose.compactVerify(signature, publicKey)) {
      this.loggerProvider.info('Signature verification failed')
      return false
    }

    this.loggerProvider.info('Signature successfully verified')

    const claims = jose.decodeJwt(token)

    if (Date.now() > claims.exp!) {
      this.loggerProvider.info('Token is expired')
      return false
    }

    if (claims.aud !== appClientId) {
      this.loggerProvider.info('Token was not issued for this audience')
      return false
    }

    this.loggerProvider.info(claims)
    return claims
  }
}