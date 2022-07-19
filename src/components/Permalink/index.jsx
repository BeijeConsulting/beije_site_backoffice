import { useCallback } from 'react';
import { permalink } from '../../utils/utils';
import Input from '../Input';

function Permalink({ state, setState }) {

  const permalinkCallback = useCallback((value)=>{
      return permalink(value);
  },[])

  const handleChange = (e) => {
    setState({ ...state, permalink: permalinkCallback(e.target.value) })
  }

  return (
    <Input
      style={{ width: "50%" }}
      placeholder="Permalink"
      name="permalink"
      value={state.permalink === "" ? permalinkCallback(state.title) : permalinkCallback(state.permalink)}
      onChange={handleChange}
    />
  )
}

export default Permalink;