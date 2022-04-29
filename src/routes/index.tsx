import { useStore } from '@tramvai/state';
import {
  fetchPokemonListAction,
  PokemonPreview,
  PokemonsStore,
} from '~entities/pokemon';

export const PokemonList = () => {
  const pokemons = useStore(PokemonsStore);
  const pokemonList = Object.values(pokemons);

  // If the list is empty, consider that it is still loading
  if (pokemonList.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <ul>
        {pokemonList.map((pokemon) => (
          <li key={pokemon.name}>
            <PokemonPreview name={pokemon.name} />
          </li>
        ))}
      </ul>
    </div>
  );
};

PokemonList.actions = [fetchPokemonListAction];

export default PokemonList;
