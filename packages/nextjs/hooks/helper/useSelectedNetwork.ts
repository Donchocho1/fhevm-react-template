import { useGlobalState } from "~~/services/store/store";

export const useSelectedNetwork = () => {
  const globalTargetNetwork = useGlobalState((state) => state.targetNetwork);
  return globalTargetNetwork;
};
