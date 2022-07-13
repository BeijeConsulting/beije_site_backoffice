export const handleRequestsModal = (type, onYes, setStateForModal, navigate = () => { }) => () => {
  switch (type.toLowerCase()) {
    case "yes":
      onYes();
      setStateForModal(false);
      break;

    case "goback":
      navigate();
      setStateForModal(false);
      break;

    default:
      setStateForModal(false);
      break;
  }
}