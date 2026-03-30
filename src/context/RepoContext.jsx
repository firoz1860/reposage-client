import { createContext, useState } from "react";

export const RepoContext = createContext(null);

export function RepoProvider({ children }) {
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoStatuses, setRepoStatuses] = useState({});

  const updateRepoStatus = (repoKey, status) => {
    setRepoStatuses((current) => ({
      ...current,
      [repoKey]: {
        ...(current[repoKey] || {}),
        ...status
      }
    }));
  };

  return (
    <RepoContext.Provider
      value={{
        selectedRepo,
        setSelectedRepo,
        repoStatuses,
        updateRepoStatus
      }}
    >
      {children}
    </RepoContext.Provider>
  );
}

