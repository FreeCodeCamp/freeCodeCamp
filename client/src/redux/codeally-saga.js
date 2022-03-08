import { call, put, select, takeEvery } from 'redux-saga/effects';
import { createFlashMessage } from '../components/Flash/redux';
import { FlashMessages } from '../components/Flash/redux/flash-messages';
import { postWebhookToken } from '../utils/ajax';
import {
  isSignedInSelector,
  showCodeAlly,
  updateWebhookToken,
  webhookTokenSelector
} from './';

const startProjectErrMessage = {
  type: 'danger',
  message: FlashMessages.StartProjectErr
};

function* tryToShowCodeAllySaga() {
  const isSignedIn = yield select(isSignedInSelector);
  const hasWebhookToken = !!(yield select(webhookTokenSelector));

  if (!isSignedIn || hasWebhookToken) {
    yield put(showCodeAlly());
  } else {
    try {
      const response = yield call(postWebhookToken);

      if (response?.token) {
        yield put(updateWebhookToken(response.token));
        yield put(showCodeAlly());
      } else {
        yield put(createFlashMessage(startProjectErrMessage));
      }
    } catch (e) {
      yield put(createFlashMessage(startProjectErrMessage));
    }
  }
}

export function createCodeAllySaga(types) {
  return [takeEvery(types.tryToShowCodeAlly, tryToShowCodeAllySaga)];
}
