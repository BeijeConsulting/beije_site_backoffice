import { permalink } from '../../utils/utils';
import Input from '../Input';

function Permalink({ state, setState }) {

  const handleChange = (e) => {
    setState({ ...state, permalink: permalink(e.target.value) })
  }

  return (
    <Input
      style={{ width: "50%" }}
      placeholder="Permalink"
      name="permalink"
      value={state.permalink}
      onChange={handleChange}
    />
  )
}

export default Permalink;