import SingleImageInput from "../SingleImageInput";

const MultipleImageInput = ({ states }) => {

  const [state, setState] = states;

  const imageList = (img, key) => {
    return (

      <div key={key + img} style={{ padding: "1rem" }}>
        <SingleImageInput
          aspectRatio="1"
          style={{ maxWidth: "200px" }}
          label={"image" + (key + 1)}
          value={img ? img : ""}
          onChange={(image) => {
            const newState = Object.assign({}, state)
            newState.images.splice(key, 1, image)
            setState({ ...state, images: newState.images });
          }}
        />
      </div>
    )

  }

  return state?.images?.length > 0 && state?.images?.map(imageList)
};

export default MultipleImageInput;
