import SingleImageInput from "../SingleImageInput";

const MultipleImageInput = ({ states, id }) => {

  const [state, setState] = states;

  const imageList = (img, key) => {

    return (

      <div key={key + img} style={{ padding: "1rem" }}>
        <SingleImageInput
          aspectRatio="1"
          style={{ maxWidth: "200px" }}
          label={"image" + (key + 1)}
          value={state.images[key]}
          onChange={(image) => {
            const newState = Object.assign({}, state);
            newState.images.splice(key, 1, image);

            setState({ ...state, images: newState.images });
          }}
          idProp={id}
        />
      </div>
    )

  }

  return Array.from(Array(5).keys()).map(imageList)
};

export default MultipleImageInput;
