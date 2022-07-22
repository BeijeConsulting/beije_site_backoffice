import React from 'react';
import logoColored from '../../assets/images/logo-colored.svg';
import styles from './styles.module.css';

function Loader({isImage}) {
  return (
    <div className={styles['logo-container']}>
        {isImage && <h3 className={styles["title"]}>Stiamo salvando i dati, attendere...</h3>}
      <img className={styles['element']} src={logoColored} alt="loader" />
    </div>
  )
}

export default Loader;