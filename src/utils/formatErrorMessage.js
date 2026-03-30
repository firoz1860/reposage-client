const quotaPattern = /quota exceeded|rate limit|resource_exhausted/i;
const emptyRepoPattern = /repository is empty|does not contain any indexable files/i;
const vectorStorePattern = /vector store is unavailable|chroma/i;

export function formatErrorMessage(message) {
  const normalized = String(message || "").trim();

  if (!normalized) {
    return "Something went wrong.";
  }

  if (emptyRepoPattern.test(normalized)) {
    return "This repository is empty or has no indexable files.";
  }

  if (quotaPattern.test(normalized)) {
    return "AI provider rate limit reached. Please retry shortly.";
  }

  if (vectorStorePattern.test(normalized)) {
    return "Vector store is unavailable. Restart indexing after the backend is up.";
  }

  return normalized
    .replace(/\s*For more information on this error[\s\S]*$/i, "")
    .replace(/\s*documentation_url[\s\S]*$/i, "")
    .trim();
}
