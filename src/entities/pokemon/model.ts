import { createEvent, createReducer } from '@tramvai/state';
import { createAction } from '@tramvai/core';
import { POKEAPI_HTTP_CLIENT } from '~shared/api';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';

export type Pokemon = {
  id: number;
  name: string;
  stats: PokemonStat[];
  types: PokemonType[];
};

export type PokemonStat = {
  // characteristic value
  base_stat: number; // eslint-disable-line @typescript-eslint/naming-convention
  // characteristic name
  stat: { name: string };
};

export type PokemonType = {
  // element type
  type: { name: string };
};

export type PokemonState = Record<string, Pokemon>;

const initialState: PokemonState = {};

export const pokemonListLoadedEvent =
  createEvent<Pokemon[]>('pokemonListLoaded');
export const pokemonLoadedEvent = createEvent<Pokemon>('pokemonLoaded');

export const fetchPokemonListAction = createAction({
  name: 'fetchPokemonList',
  deps: { pokeapiHttpClient: POKEAPI_HTTP_CLIENT },
  fn: async (context, payload, deps) => {
    const limit = 10;
    const offset = 0;

    // download a list of the names of the first 10 pokemon https://pokeapi.co/api/v2/pokemon/?limit=10&offset=0
    const pokemonsNamesResponse = await deps.pokeapiHttpClient.get<{
      results: { name: string }[];
    }>('/pokemon', { query: { limit, offset } });
    const pokemonsNames = pokemonsNamesResponse.payload.results;

    // download detailed information about each pokemon in parallel https://pokeapi.co/api/v2/pokemon/bulbasaur/
    const pokemonList = await Promise.all(
      pokemonsNames.map(async ({ name }) => {
        const pokemonResponse = await deps.pokeapiHttpClient.get<Pokemon>(
          `/pokemon/${name}`
        );
        return pokemonResponse.payload;
      })
    );

    // save the final list to the reducer
    await context.dispatch(pokemonListLoadedEvent(pokemonList));
  },
});

export const fetchPokemonAction = createAction({
  name: 'fetchPokemon',
  deps: {
    pokeapiHttpClient: POKEAPI_HTTP_CLIENT,
    pageService: PAGE_SERVICE_TOKEN,
  },
  conditions: {
    // disable caching of the action, since it must be executed again for different name values
    always: true,
  },
  fn: async (context, payload, deps) => {
    // access to the `:name` parameter of the current route via PAGE_SERVICE_TOKEN
    const { name } = await deps.pageService.getCurrentRoute().params;
    // loading information about the pokemon
    const pokemonResponse = await deps.pokeapiHttpClient.get<Pokemon>(
      `/pokemon/${name}`
    );
    // save information about the pokemon in the store
    await context.dispatch(pokemonLoadedEvent(pokemonResponse.payload));
  },
});

export const PokemonsStore = createReducer('pokemons', initialState)
  .on(pokemonListLoadedEvent, (state, pokemonList) => {
    return pokemonList.reduce((nextState, pokemon) => {
      return {
        ...nextState,
        [pokemon.name]: {
          ...nextState[pokemon.name],
          ...pokemon,
        },
      };
    }, state);
  })
  .on(pokemonLoadedEvent, (state, pokemon) => {
    return {
      ...state,
      [pokemon.name]: {
        ...state[pokemon.name],
        ...pokemon,
      },
    };
  });
