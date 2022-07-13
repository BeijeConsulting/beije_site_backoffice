import ReactPortal from '../ReactPortal';
import './styles.css';
import { handleRequestsModal } from '../../utils/modal';
import { useNavigate } from 'react-router-dom';

const Modal = ({ children, goBack, path, shouldShow, setModal, actions, setGoBack }) => {
	const navigate = useNavigate();

	const onRequestModal = (action) => {

		setModal(false);
		switch (action) {
			case "yes":
				if (goBack) {
					actions?.save()
					setGoBack(false)
				}
				actions?.disable()
				break;
			case "goback":

				navigate(path)
				break;

			default:
				break;
		}
	}

	return shouldShow ? (
		<ReactPortal>
			<div className="modalBackground" onClick={() => { onRequestModal(goBack ? "goback" : "no") }}>
				<div className="modalBody" onClick={e => e.stopPropagation()}>
					{children}
					<div className='btnContainer'>
						<button className="secondary-button btnMargin" onClick={() => { onRequestModal(goBack ? "goback" : "no") }}>No</button>
						<button className="primary-button" onClick={() => { onRequestModal("yes") }}>Si</button>
					</div>
				</div>
			</div>
		</ReactPortal>
	) : null;
}

export default Modal;