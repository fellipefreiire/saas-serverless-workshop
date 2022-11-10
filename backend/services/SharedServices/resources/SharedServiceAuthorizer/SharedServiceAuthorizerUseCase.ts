import axios from 'axios'
import jose from 'jose'

import { ISharedServiceAuthorizerRequestDTO } from './SharedServiceAuthorizerDTO';

import { IAuthManagerProvider } from '/opt/nodejs/providers/interfaces/IAuthManagerProvider';
import { IAuthPolicyProvider } from '/opt/nodejs/providers/interfaces/IAuthPolicyProvider';
import { IHttpVerbProvider } from '/opt/nodejs/providers/interfaces/IHttpVerbProvider';
import { ILoggerProvider } from '/opt/nodejs/providers/interfaces/ILoggerProvider';

const appClientOperationUser = process.env.OPERATION_USERS_APP_CLIENT
const region = process.env.AWS_REGION
const tenantUserPoolId = process.env.OPERATION_USERS_USER_POOL
const tenantAppClientId = process.env.OPERATION_USERS_APP_CLIENT
const userPoolOperationUser = process.env.OPERATION_USERS_USER_POOL

export class SharedServiceAuthorizerUseCase {
  constructor(
    private authManagerProvider: IAuthManagerProvider,
    private authPolicyProvider: IAuthPolicyProvider,
    private httpVerbProvider: IHttpVerbProvider,
    private loggerProvider: ILoggerProvider
  ) { }
  async execute(
    {
      event,
      context
    }: ISharedServiceAuthorizerRequestDTO
  ) {
    try {
      this.loggerProvider.info('AUTHORIZER INIT')
      const token = event.authorizationToken.split(" ")

      if (token[0] !== 'Bearer') {
        throw new Error('Authorization header should have a format bearer <JWT> Token')
      }

      const jwtBearerToken = token[1]
      this.loggerProvider.info('Method ARN: ' + event.methodArn)

      const unauthorizedClaims = jose.decodeJwt(jwtBearerToken)
      this.loggerProvider.info(unauthorizedClaims)

      let userpoolId
      let appClientId

      if (this.authManagerProvider.isSaaSProvider(String(unauthorizedClaims['custom:userRole']))) {
        userpoolId = userPoolOperationUser
        appClientId = appClientOperationUser
      } else {
        userpoolId = tenantUserPoolId
        appClientId = tenantAppClientId
      }

      const keysUrl =
        `https://cognito-idp.${region}.amazonaws.com/${userpoolId}/.well-known/jwks.json`

      const response = await axios.get(keysUrl)

      const keys: jose.JWK[] = response.data

      const validJwt = await this.validateJWT(jwtBearerToken, appClientId, keys)

      let principalId: string
      let userName: string
      let tenantId: string
      let userRole: string

      if (validJwt === false) {
        this.loggerProvider.error('Unauthorized')
        throw new Error('Unauthorized')
      } else {
        this.loggerProvider.info(validJwt)
        principalId = validJwt.sub!
        userName = validJwt['cognito:username'] as string
        tenantId = validJwt['custom:tenantId'] as string
        userRole = validJwt['custom:userRole'] as string
      }

      const tmp = event.methodArn.split(':')
      const apigatewayArnTmp = tmp[5].split('/')
      const awsAccountId = tmp[4]


      this.authPolicyProvider.principalId = principalId!
      this.authPolicyProvider.awsAccountId = awsAccountId
      this.authPolicyProvider.restApiId = apigatewayArnTmp[0]
      this.authPolicyProvider.region = tmp[3]
      this.authPolicyProvider.stage = apigatewayArnTmp[1]

      if (
        this.authManagerProvider.isTenantAdmin(userRole) ||
        this.authManagerProvider.isSystemAdmin(userRole)
      ) {
        this.authPolicyProvider.allowAllMethods()
      }

      if (this.authManagerProvider.isTenantAdmin(userRole)) {
        this.authPolicyProvider
          .denyMethod(this.httpVerbProvider.POST, 'tenant-activation')
        this.authPolicyProvider.denyMethod(this.httpVerbProvider.GET, 'tenants')
      } else {
        this.authPolicyProvider.allowMethod(this.httpVerbProvider.GET, 'user/*')
        this.authPolicyProvider.allowMethod(this.httpVerbProvider.PUT, 'user/*')
      }

      const authResponse = this.authPolicyProvider.build()

      context = {
        'userName': userName,
        'userPoolId': userpoolId,
        'tenantId': tenantId,
        'userRole': userRole
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