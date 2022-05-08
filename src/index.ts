import './global.module.css';
import { createApp } from '@tramvai/core';
import { CommonModule } from '@tramvai/module-common';
import { SpaRouterModule } from '@tramvai/module-router';
import { RenderModule } from '@tramvai/module-render';
import { ServerModule } from '@tramvai/module-server';
import { ErrorInterceptorModule } from '@tramvai/module-error-interceptor';
import { SeoModule } from '@tramvai/module-seo';
import { HttpClientModule } from '@tramvai/module-http-client';
import {
  RENDER_SLOTS,
  ResourceType,
  ResourceSlot,
} from '@tramvai/tokens-render';
import { HeaderModule } from '~shared/header';
import { PokeApiModule } from '~shared/api';
import { PokemonModule } from '~entities/pokemon-preview';
import { PapiTestModule } from '~shared/papi-test';

createApp({
  name: 'pokedex',
  modules: [
    CommonModule,
    SpaRouterModule,
    RenderModule.forRoot({ useStrictMode: true }),
    SeoModule,
    ServerModule,
    ErrorInterceptorModule,
    HeaderModule,
    HttpClientModule,
    PokeApiModule,
    PokemonModule,
    PapiTestModule,
  ],
  providers: [
    {
      provide: RENDER_SLOTS,
      multi: true,
      useValue: {
        type: ResourceType.asIs,
        slot: ResourceSlot.HEAD_META,
        payload:
          '<meta name="viewport" content="width=device-width, initial-scale=1">',
      },
    },
    {
      provide: RENDER_SLOTS,
      multi: true,
      useValue: {
        type: ResourceType.style,
        slot: ResourceSlot.HEAD_CORE_STYLES,
        payload: 'https://fonts.googleapis.com/css2?family=Lato&display=swap',
      },
    },
    // {
    //   provide: SERVER_MODULE_PAPI_PUBLIC_ROUTE,
    //   multi: true,
    //   deps: {
    //     createCache: CREATE_CACHE_TOKEN, // this is a dependency from the root container, which will be created only once
    //   },
    //   useFactory: ({ createCache }) => {
    //     const cache = createCache(); // cache must be common for all handler calls, so we call it outside createPapiMethod
    //
    //     return createPapiMethod({
    //       path: '/pikachu', // route will be available at server/pokedex/papi/pikachu
    //       method: 'get', // method, can be post, all and so on
    //       deps: {
    //         httpClient: HTTP_CLIENT, // the same dependency must be recreated for each call, and they must be independent
    //       },
    //       async handler(deps: { httpClient: HttpClient }) {
    //         // function that will be called if requests for url come
    //         // use what was requested in deps from createPapiMethod
    //         if (cache.has('pikachu')) {
    //           return {
    //             payload: cache.get('pikachu'),
    //             fromCache: true,
    //           };
    //         }
    //
    //         const { payload } = await deps.httpClient.get(
    //           'https://pokeapi.co/api/v2/pokemon/pikachu'
    //         );
    //         cache.set('pikachu', payload);
    //         return { payload, fromCache: false };
    //       },
    //     });
    //   },
    // },
  ],
});
