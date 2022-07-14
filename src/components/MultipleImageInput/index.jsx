import SingleImageInput from "../SingleImageInput";

const MultipleImageInput = ({ state }) => {

  const imageList = (img, key) => {
    return (
      <div style={{padding: "1rem"}}>
        <SingleImageInput
          key={key + img}
          aspectRatio="1"
          style={{ maxWidth: "300px" }}
          label={"image" + (key + 1)}
          value={img}
          onChange={(image) => {
            const newState = Object.assign({}, state)
            newState.images.splice(key, 1, image)
            state[1]((p) => ({ ...p, images: newState.images }));
          }}
        />
      </div>
    )

  }
  return (
    // <></>
    state[0]?.images?.length > 0 && state[0]?.images?.map(imageList)

  );
};

export default MultipleImageInput;
