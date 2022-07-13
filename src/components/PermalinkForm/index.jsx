import { useCallback } from 'react';
import { permalink } from '../../utils/utils';
import Input from '../Input';

import styles from './styles.module.css';

function PermalinkForm({ isNew, state, setState, putPermalinkApi }) {
  

  const handleClick = useCallback((e) => {
    e.preventDefault();
    putPermalinkApi(state);
  }, [state.permalink]);

  const handleChange = (e) => {
    setState({ ...state, permalink: permalink(e.target.value) })
  }

  return (
    <div className={styles["inputs-row"]}>
      <Input
        style={{ width: "50%" }}
        placeholder="Permalink"
        name="permalink"
        value={state.permalink}
        onChange={handleChange}
      />

      {
        !isNew &&
        <button className="success-button"
          onClick={handleClick}>Salva Permalink</button>
      }
    </div>
  )
}

export default PermalinkForm;