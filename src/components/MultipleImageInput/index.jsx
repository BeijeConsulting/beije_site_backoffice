import SingleImageInput from "../SingleImageInput";

const MultipleImageInput = ({ states, id, savedImage, isBlogMassive, type }) => {

  const [state, setState] = states;

  console.log('test', state)
  const imageList = (img, key) => {

    return (

      <div key={key + img} style={{ padding: " 0 1rem" }}>
        <SingleImageInput
          type={type}
          isBlogMassive={isBlogMassive}
          noEdit={true}
          aspectRatio="1"
          style={{ maxWidth: "200px" }}
          value={state[key]}
          onChange={(image, isRemoved = false) => {
            const newState = state
            if (isRemoved) {
              newState.splice(key, 1)
              savedImage.splice(key, 1)
            }
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
