import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import { handleRequestsModal } from '../utils/modal';

/**
 * @param  {boolean} isSaved
 * @param  {boolean} shouldShowModal
 * @param  {function} apiCall
 */
const useBack = ({ isSaved, shouldShowModal, apiCall }) => {

  const [save, setSave] = useState(isSaved)

  const navigate = useNavigate();

  const onClickYes = useCallback(() => {
    apiCall();
  }, [])

  const handleBackNavigation = useCallback(() => {
    if (!save) {
      return setSave(true)
      // return (
      //   <Modal
      //     shouldShowModal={shouldShowModal}
      //     onRequestClose={handleRequestsModal("no", onClickYes, setShouldShowModal)}
      //     onRequestYes={handleRequestsModal("yes", onClickYes, setShouldShowModal)}
      //   >
      //     <Message message={"Non hai salvato, vuoi Salvare?"} />
      //   </Modal>
      // )
    }
    navigate(-1);
  }, [isSaved])

  return [save, handleBackNavigation];
}

export default useBack
