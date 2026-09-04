import {ApplicationConfig, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {AppPaginatorIntl} from './config/paginator-intl';

import {provideEchartsCore} from 'ngx-echarts';
import * as echarts from 'echarts/core';

import {BarChart, LineChart} from 'echarts/charts';
import {DataZoomComponent, GridComponent, TitleComponent, ToolboxComponent, TooltipComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import {includeBearerTokenInterceptor} from 'keycloak-angular';
import {provideKeycloakAndInterceptor} from './security/keycloak.initializer';
import {catchHttpExceptionInterceptor} from './config/catch-http-exception.interceptor';
import {provideNativeDateAdapter} from '@angular/material/core';

echarts.use([
  BarChart,
  LineChart,
  TooltipComponent,
  DataZoomComponent,
  ToolboxComponent,
  TitleComponent,
  GridComponent,
  CanvasRenderer
]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideNativeDateAdapter(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        includeBearerTokenInterceptor,
        catchHttpExceptionInterceptor
      ])
    ),
    provideEchartsCore({echarts}),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
        appearance: 'outline',
      }
    },
    {
      provide: MatPaginatorIntl,
      useClass: AppPaginatorIntl,
    },
    provideKeycloakAndInterceptor()
  ]
};
