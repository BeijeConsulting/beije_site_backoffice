import { useCallback } from 'react';
import { permalink } from '../../utils/utils';
import Input from '../Input';

function Permalink({ state, setState, title }) {

  const permalinkCallback = useCallback((value) => {
    return permalink(value);
  }, [])

  const handleChange = (e) => {
    setState({ ...state, permalink: state.permalink === "" ? permalinkCallback(state[title]) : e.target.value})
  }

  return (
    <Input
      style={{ width: "100%", marginTop: 20 }}
      placeholder="Permalink"
      name="permalink"
      value={state.permalink === "" ? permalinkCallback(state[title]) : permalinkCallback(state.permalink)}
      onChange={handleChange}
    />
  )
}

export default Permalink;