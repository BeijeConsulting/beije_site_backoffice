import React from 'react';
import logoColored from '../../assets/images/logo-colored.svg';
import styles from './styles.module.css';

function Loader() {
  return (
    <div className={styles['logo-container']}>
      <img className={styles['element']} src={logoColored} />
    </div>
  )
}

export default Loader;