export const adaptBackendConnection = (backendConn) => {
  return {
    id: backendConn._id,
    from: backendConn.from,
    to: backendConn.to,
    style: {
      color: backendConn.style?.color ?? "#6ae3ff",
      width: backendConn.style?.width ?? 2,
    },
    createdAt: backendConn.createdAt,
  };
};