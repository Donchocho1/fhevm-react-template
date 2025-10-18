import { useGlobalState } from "~~/services/store/store";

export const useTargetNetwork = () => {
  const targetNetwork = useGlobalState((state) => state.targetNetwork);
  const setTargetNetwork = useGlobalState((state) => state.setTargetNetwork);
  return { targetNetwork, setTargetNetwork };
};
