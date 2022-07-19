import { memo } from 'react';
import styles from './styles.module.css';

function CardContainer({ children, head }) {
  return (
    <div className={styles["card"]}>
      <h4 className={styles["title"]}>{head}</h4>
      {children}
    </div>
  )
}

const CardContainerMemo = memo(CardContainer);

export default CardContainerMemo;
