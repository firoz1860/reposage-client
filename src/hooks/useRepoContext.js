import { useContext } from "react";
import { RepoContext } from "../context/RepoContext";

export function useRepoContext() {
  return useContext(RepoContext);
}

