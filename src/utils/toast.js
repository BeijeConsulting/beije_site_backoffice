import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const notify = (type, toastId) => {
    let message = ""
    switch (type.toLowerCase()) {
        case "success":
            message = "Salvato"
            break;
        case "error":
            message = "Qualcosa è andato storto"
            break;
    }
    toast[type](message, {
        position: toast.POSITION.TOP_CENTER,
        pauseOnHover: false,
        toastId
    })
}

export { notify, ToastContainer }