import {
  AutoRefreshTokenService,
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken
} from 'keycloak-angular';
import {environment} from '../../environments/environment';
import {buildUrl, buildUrlFromInterface} from '../common/utils/function.utils';

export const provideKeycloakAndInterceptor = () => {
  const url: string = buildUrlFromInterface(environment.api);

  const escapedUrl: string = url.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

  const urlConditions = [
    createInterceptorCondition<IncludeBearerTokenCondition>({
        // eslint-disable-next-line no-useless-escape
        urlPattern: new RegExp(`^(${escapedUrl})(\/.*)?$`, 'i'),
        bearerPrefix: 'Bearer',
      },
    ),
  ];

  return [
    provideKeycloak({
      config: {
        url: buildUrlFromInterface(environment.auth),
        realm: 'gestion-stock',
        clientId: 'gestion-stock-frontend'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        redirectUri: window.location.origin,
        enableLogging: true
      },
      features: [
        withAutoRefreshToken({
          onInactivityTimeout: "login",
          sessionTimeout: 300000
        })
      ],
      providers: [AutoRefreshTokenService, UserActivityService],
    }),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: urlConditions,
    }
  ];
}
