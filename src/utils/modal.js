export const handleRequestsModal = (type, onYes, setStateForModal) => () => {
  switch (type) {
    case "yes":
      onYes();
      setStateForModal(false);
      break;

    default:
      setStateForModal(false);
      break;
  }
}