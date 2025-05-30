import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {AppPaginatorIntl} from './config/paginator-intl';

import {provideEchartsCore} from 'ngx-echarts';
import * as echarts from 'echarts/core';

import {BarChart, LineChart} from 'echarts/charts';
import {DataZoomComponent, GridComponent, TitleComponent, ToolboxComponent, TooltipComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';

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
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideEchartsCore({ echarts }),
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
    }
  ]
};
