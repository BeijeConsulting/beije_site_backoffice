import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useId } from "react";

const Home = () => {
  const toastId = useId();

  const notify = (type, message) => {
    toast[type](message, {
      position: toast.POSITION.TOP_CENTER,
      toastId
    })
  }
  const funct = () => {
    notify('success', "successo")
  }

  return (<div><h2>Beije</h2>
    <button className="primary-button"
      onClick={
        funct
      }>Disabilita</button>
    <ToastContainer /></div >);
};

export default Home;
