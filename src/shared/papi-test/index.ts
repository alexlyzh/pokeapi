import { Module } from '@tramvai/core';
import { SERVER_MODULE_PAPI_PUBLIC_ROUTE } from '@tramvai/tokens-server';
import { CREATE_CACHE_TOKEN } from '@tramvai/module-common';
import { createPapiMethod } from '@tramvai/papi';
import type { HttpClient } from '@tramvai/module-http-client';
import { HTTP_CLIENT } from '@tramvai/module-http-client';

@Module({
  providers: [
    {
      provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
      multi: true,
      deps: {
        createCache: CREATE_CACHE_TOKEN, // this is a dependency from the root container, which will be created only once
      },
      useFactory: ({ createCache }) => {
        const cache = createCache(); // cache must be common for all handler calls, so we call it outside createPapiMethod

        return createPapiMethod({
          path: '/pikachu', // route will be available at server/pokedex/papi/pikachu
          method: 'get', // method, can be post, all and so on
          deps: {
            httpClient: HTTP_CLIENT, // the same dependency must be recreated for each call, and they must be independent
          },
          async handler(deps: { httpClient: HttpClient }) {
            // function that will be called if requests for url come
            // use what was requested in deps from createPapiMethod
            if (cache.has('pikachu')) {
              return {
                payload: cache.get('pikachu'),
                fromCache: true,
              };
            }

            const { payload } = await deps.httpClient.get(
              'https://pokeapi.co/api/v2/pokemon/pikachu'
            );
            cache.set('pikachu', payload);
            return { payload, fromCache: false };
          },
        });
      },
    },
  ],
})
export class PapiTestModule {}
