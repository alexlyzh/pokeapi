import { Link } from '@tramvai/module-router';
import { useStoreSelector } from '@tramvai/state';
import { useDi } from '@tramvai/react';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { fetchPokemonAction, PokemonsStore } from '~entities/pokemon-preview';
import type { Pokemon, PokemonStat } from '~entities/pokemon-preview';

const findStatByName = (
  pokemon: Pokemon,
  statKey: string
): PokemonStat | undefined => {
  return pokemon.stats.find((stat) => statKey === stat.stat.name);
};

export const PokemonView = () => {
  // get PAGE_SERVICE_TOKEN from DI
  const pageService = useDi(PAGE_SERVICE_TOKEN);
  // access to the `:name` parameter of the current route via PAGE_SERVICE_TOKEN
  const { name } = pageService.getCurrentRoute().params;
  const pokemon = useStoreSelector(PokemonsStore, (pokemons) => pokemons[name]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  const hpStat = findStatByName(pokemon, 'hp');
  const attackStat = findStatByName(pokemon, 'attack');
  const defenseStat = findStatByName(pokemon, 'defense');
  const speedStat = findStatByName(pokemon, 'speed');

  return (
    <div className="container">
      <div>
        <Link url="/">Return to list</Link>
      </div>
      <img
        alt={pokemon.name}
        width={200}
        height={200}
        src={`https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`}
      />
      <h2>{pokemon.name}</h2>
      <div>
        <p>Stats</p>
        <ul>
          {hpStat && <li>HP: {hpStat.base_stat}</li>}
          {attackStat && <li>Attack: {attackStat.base_stat}</li>}
          {defenseStat && <li>Defense: {defenseStat.base_stat}</li>}
          {speedStat && <li>Speed: {speedStat.base_stat}</li>}
        </ul>
      </div>
      <div>
        <p>Types</p>
        <ul>
          {pokemon.types.map((type) => {
            const typeKey = type.type.name;
            return (
              <li key={typeKey} data-type={typeKey}>
                {typeKey}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

PokemonView.actions = [fetchPokemonAction];

export default PokemonView;
