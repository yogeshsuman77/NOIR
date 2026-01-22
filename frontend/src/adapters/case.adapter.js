export const adaptBackendCase = (backendCase) => {
  return {
    id: backendCase._id,
    title: backendCase.title,
    description: backendCase.description,
    createdAt: backendCase.createdAt,
    updatedAt: backendCase.updatedAt,
  };
};
