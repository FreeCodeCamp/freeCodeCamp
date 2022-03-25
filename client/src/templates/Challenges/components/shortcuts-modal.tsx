import { Button, Modal } from '@freecodecamp/react-bootstrap';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { executeGA } from '../../../redux';
import { closeModal, isShortcutsModalOpenSelector } from '../redux';

import './shortcuts-modal.css';

interface ShortcutsModalProps {
  closeShortcutsModal: () => void;
  executeGA: (attributes: { type: string; data: string }) => void;
  isOpen?: boolean;
  t: (text: string) => string;
}

const mapStateToProps = (state: unknown) => ({
  isOpen: isShortcutsModalOpenSelector(state) as boolean
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    { executeGA, closeShortcutsModal: () => closeModal('shortcuts') },
    dispatch
  );

export function ShortcutsModal({
  closeShortcutsModal,
  executeGA,
  isOpen,
  t
}: ShortcutsModalProps): JSX.Element {
  if (isOpen) {
    executeGA({ type: 'modal', data: '/shortcuts-modal' });
  }
  return (
    <Modal
      dialogClassName='shortcuts-modal'
      onHide={closeShortcutsModal}
      show={isOpen}
    >
      <Modal.Header
        className='shortcuts-modal-header fcc-modal'
        closeButton={true}
      >
        <Modal.Title className='text-center'>
          Keyboard shortcuts <br />
          {t('shortcuts.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='shortcuts-modal-body'>
        <ul>
          <li>
            <h4>Previous Exercise</h4>
            <span>p</span>
          </li>
          <li>
            <h4>Next Exercise</h4>
            <span>n</span>
          </li>
          <li>
            <h4>Close modal</h4>
            <span>ESC</span>
          </li>
        </ul>
        <Button
          block={true}
          bsSize='sm'
          bsStyle='primary'
          onClick={closeShortcutsModal}
        >
          {t('buttons.close')}
        </Button>
      </Modal.Body>
    </Modal>
  );
}

ShortcutsModal.displayName = 'ShortcutsModal';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ShortcutsModal));
