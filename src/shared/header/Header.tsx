import styles from './Header.module.css';
import globalStyles from '../../global.module.css';

export const Header = () => (
  <div className={globalStyles.container}>
    <div className={styles.Header}>
      <img
        alt="pokeball"
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
        width={25}
        height={25}
      />
      <h1>Pokedex</h1>
    </div>
  </div>
);
