const AddMenu = ({ dispatch }) => {


  return (
    <>
      <button
        onClick={() => {
          dispatch({
            type: "START_PLACEMENT",
            payload: "text",
          });
        }}
      >
        Text Clue
      </button>

      <button
        onClick={() => {
          dispatch({
            type: "START_PLACEMENT",
            payload: "image",
          });
        }}
      >
        Image Clue
      </button>

      <button
        onClick={() => {
          dispatch({
            type: "START_PLACEMENT",
            payload: "video",
          });
        }}
      >
        Video Clue
      </button>
    </>
  );
};

export default AddMenu;
