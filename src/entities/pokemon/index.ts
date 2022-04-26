import { Module } from '@tramvai/core';
import { COMBINE_REDUCERS } from '@tramvai/tokens-common';
import { PokemonsStore } from './model';

export * from './model';
export * from './ui';

@Module({
  providers: [
    // register reducer in the application
    {
      provide: COMBINE_REDUCERS,
      useValue: PokemonsStore,
      multi: true,
    },
  ],
})
export class PokemonModule {}
