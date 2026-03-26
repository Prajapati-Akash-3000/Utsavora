export const toastVariants = {
  hidden: {
    opacity: 0,
    y: -20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15
    }
  }
};
