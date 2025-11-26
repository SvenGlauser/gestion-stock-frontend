import {
  AutoRefreshTokenService,
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken
} from 'keycloak-angular';

export const provideKeycloakAndInterceptor = () => {
  const urlConditions = [
    createInterceptorCondition<IncludeBearerTokenCondition>({
        // eslint-disable-next-line no-useless-escape
        urlPattern: new RegExp(`^(http:\/\/localhost:8080)(\/.*)?$`, 'i'),
        bearerPrefix: 'Bearer',
      },
    ),
    // you can add more interceptors in this array...
  ];

  return [
    provideKeycloak({
      config: {
        url: 'http://localhost:8081/',
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
