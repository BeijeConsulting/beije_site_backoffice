const Modal = ({ shouldShow, onRequestClose, children }) => {

	return shouldShow ? (
		<div className="modalBackground" onClick={onRequestClose}>
			<div className="modalBody" onClick={e => e.stopPropagation()}>
				{children}
			</div>
		</div>
	) : null;
}

export default Modal;