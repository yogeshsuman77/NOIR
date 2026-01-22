export const createConnection = ({
  id,
  from,
  to,
  label = "",
}) => {
  const now = Date.now();

  return {
    id,
    from,
    to,
    label,

    style: {
      color: "#6ae3ff",
      width: 2,
    },

    createdAt: now,
  };
};
