import SingleImageInput from "../SingleImageInput";

const MultipleImageInput = ({ states, id }) => {

  const [state, setState] = states;
  console.log('testa', state)
  const imageList = (img, key) => {

    return (

      <div key={key + img} style={{ padding: "1rem" }}>
        <SingleImageInput
          isBlogMassive={true}
          aspectRatio="1"
          style={{ maxWidth: "200px" }}
          label={"image" + (key + 1)}
          value={state[key]}
          onChange={(image, isRemoved = false) => {
            const newState = state
            if (isRemoved) newState.splice(key, 1)
            else newState.splice(key, 1, image)
            setState([...newState]);
          }}
          idProp={id}
        />
      </div>
    )

  }

  return Array.from(Array(state.length).keys()).map(imageList)
};

export default MultipleImageInput;
