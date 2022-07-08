import React from "react";

import styles from './styles.module.css';

const Message = ({message}) => {
  return (
    <h4 className={styles['message']}>{message}</h4>
  )
}

export default React.memo(Message);