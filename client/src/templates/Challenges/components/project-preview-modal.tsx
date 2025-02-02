import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from '@freecodecamp/ui';

import type { CompletedChallenge } from '../../../redux/prop-types';
import {
  closeModal,
  setEditorFocusability,
  projectPreviewMounted
} from '../redux/actions';
import { isProjectPreviewModalOpenSelector } from '../redux/selectors';
import { projectPreviewId } from '../utils/frame';
import Preview from './preview';

import './project-preview-modal.css';

interface ProjectPreviewMountedPayload {
  challengeData: CompletedChallenge | null;
}

interface Props {
  closeModal: (arg: string) => void;
  isOpen: boolean;
  projectPreviewMounted: (payload: ProjectPreviewMountedPayload) => void;
  challengeData: CompletedChallenge | null;
  setEditorFocusability: (focusability: boolean) => void;
  previewTitle: string;
  closeText: string;
}

const mapStateToProps = (state: unknown) => ({
  isOpen: isProjectPreviewModalOpenSelector(state) as boolean
});
const mapDispatchToProps = {
  closeModal,
  setEditorFocusability,
  projectPreviewMounted
};

function ProjectPreviewModal({
  closeModal,
  isOpen,
  projectPreviewMounted,
  challengeData,
  setEditorFocusability,
  previewTitle,
  closeText
}: Props): JSX.Element {
  useEffect(() => {
    if (isOpen) setEditorFocusability(false);
  });

  return (
    <Modal
      size='large'
      onClose={() => {
        closeModal('projectPreview');
        setEditorFocusability(true);
      }}
      open={isOpen}
    >
      <Modal.Header closeButtonClassNames='close'>{previewTitle}</Modal.Header>
      <Modal.Body className='project-preview-modal-body'>
        <Preview
          previewId={projectPreviewId}
          previewMounted={() => projectPreviewMounted({ challengeData })}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          block={true}
          size='large'
          variant='primary'
          onClick={() => {
            closeModal('projectPreview');
            setEditorFocusability(true);
          }}
        >
          {closeText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ProjectPreviewModal.displayName = 'ProjectPreviewModal';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectPreviewModal);
