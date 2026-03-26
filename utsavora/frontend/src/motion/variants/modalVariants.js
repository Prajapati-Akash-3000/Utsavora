export const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const modal = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.28 }
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { duration: 0.18 }
  }
};
