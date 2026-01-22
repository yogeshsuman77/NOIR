import { useReducer } from "react";
import { boardReducer, initialBoardState } from "./boardReducer";

export const useBoardState = () => {

  const [state, dispatch] = useReducer(
    boardReducer,
    initialBoardState
  );

  return { state, dispatch };

}