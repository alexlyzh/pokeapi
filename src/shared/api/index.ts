import { Module, createToken } from '@tramvai/core';
import { ENV_MANAGER_TOKEN, ENV_USED_TOKEN } from '@tramvai/module-common';
import type { HttpClient } from '@tramvai/module-http-client';
import { HTTP_CLIENT_FACTORY } from '@tramvai/module-http-client';

const POKEAPI_BASE_URL = 'POKEAPI_BASE_URL';

export const POKEAPI_HTTP_CLIENT = createToken<HttpClient>(
  'pokeapi HTTP client'
);

@Module({
  providers: [
    {
      provide: ENV_USED_TOKEN,
      multi: true,
      useValue: [
        {
          key: POKEAPI_BASE_URL,
          value: 'https://pokeapi.co/api/v2/',
          optional: true,
        },
      ],
    },
    {
      provide: POKEAPI_HTTP_CLIENT,
      // all dependencies from deps will be taken from DI and passed to useFactory
      deps: {
        factory: HTTP_CLIENT_FACTORY,
        envManager: ENV_MANAGER_TOKEN,
      },
      // what the useFactory call will return will be written to the DI,
      // and the dependency types will be derived automatically from the deps
      useFactory: ({ factory, envManager }) => {
        return factory({
          name: 'pokeapi',
          baseUrl: envManager.get(POKEAPI_BASE_URL),
        });
      },
    },
  ],
})
export class PokeApiModule {}
