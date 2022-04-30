import { useStoreSelector } from '@tramvai/state';
import { Link } from '@tramvai/module-router';
import { PokemonsStore } from './model';
import styles from './ui.module.css';

export const PokemonPreview = ({ name }: { name: string }) => {
  const pokemon = useStoreSelector(PokemonsStore, (pokemons) => pokemons[name]);
  const pokemonUrl = `/pokemon/${pokemon.name}`;

  return (
    <div className={styles.pokemon}>
      <Link url={pokemonUrl}>
        <img
          className={styles.img}
          alt={pokemon.name}
          src={`https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`}
        />
        <p>{pokemon.name}</p>
      </Link>
    </div>
  );
};
