import  './styles.css';
const Modal = ({ shouldShow, onRequestClose, onRequestYes, children }) => {

	return shouldShow ? (
		<div className="modalBackground" onClick={onRequestClose}>
			<div className="modalBody" onClick={e => e.stopPropagation()}>
				{children}
       <div className='btnContainer'>
         <button className="secondary-button btnMargin" onClick={onRequestClose}>No</button>
         <button className="primary-button" onClick={onRequestYes}>Si</button>
       </div>
			</div>
		</div>
	) : null;
}

export default Modal;