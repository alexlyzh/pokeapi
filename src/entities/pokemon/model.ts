import { createEvent, createReducer } from '@tramvai/state';
import { createAction } from '@tramvai/core';
import { POKEAPI_HTTP_CLIENT } from '~shared/api';

export type Pokemon = {
  id: number;
  name: string;
};

export type PokemonState = Record<string, Pokemon>;

const initialState: PokemonState = {};

export const pokemonListLoadedEvent =
  createEvent<Pokemon[]>('pokemonListLoaded');
export const pokemonLoadedEvent = createEvent<Pokemon>('pokemonLoaded');

export const fetchPokemonListAction = createAction({
  name: 'fetchPokemonList',
  fn: async (context, payload, deps) => {
    const limit = 10;
    const offset = 0;

    // upload a list of the names of the first 10 pokemon https://pokeapi.co/api/v2/pokemon/?limit=10&offset=0
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
    context.dispatch(pokemonListLoadedEvent(pokemonList));
  },
  deps: {
    pokeapiHttpClient: POKEAPI_HTTP_CLIENT,
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
