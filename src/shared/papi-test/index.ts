import { createPapiMethod } from '@tramvai/papi';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { provide, Module } from '@tramvai/core';

@Module({
  providers: [
    provide({
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      useValue: createPapiMethod({
        method: 'get', // method, can be post, all and so on
        path: '/test', // path where the route will be available
        async handler(_req, _res): Promise<any> {
          // function that will be called if requests for url come
          return Promise.resolve({ test: true });
        },
      }),
    }),
  ],
})
export class PapiTestModule {}
