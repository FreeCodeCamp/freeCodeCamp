import React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { SuperBlocks } from '../../../../config/certification-settings';
import {
  isSignedInSelector,
  userSelector,
  userFetchStateSelector
} from '../../redux/selectors';
import CircleCheckRegular from './assets/circle-check-regular';

interface FetchState {
  pending: boolean;
  complete: boolean;
  errored: boolean;
}

interface User {
  isRespWebDesignCert: boolean;
  is2018DataVisCert: boolean;
  isApisMicroservicesCert: boolean;
  isBackEndCert: boolean;
  isDataAnalysisPyCertV7: boolean;
  isDataVisCert: boolean;
  isFrontEndCert: boolean;
  isFrontEndLibsCert: boolean;
  isFullStackCert: boolean;
  isInfosecCertV7: boolean;
  isInfosecQaCert: boolean;
  isJsAlgoDataStructCert: boolean;
  isMachineLearningPyCertV7: boolean;
  isQaCertV7: boolean;
  isRelationalDatabaseCertV8: boolean;
  isSciCompPyCertV7: boolean;
}

const mapStateToProps = createSelector(
  userFetchStateSelector,
  isSignedInSelector,
  userSelector,
  (fetchState: FetchState, isSignedIn: boolean, user: User) => ({
    fetchState,
    isSignedIn,
    user
  })
);

const certsMap = {
  [SuperBlocks.RespWebDesignNew]: false,
  [SuperBlocks.RespWebDesign]: false,
  [SuperBlocks.JsAlgoDataStruct]: false,
  [SuperBlocks.JsAlgoDataStructNew]: false,
  [SuperBlocks.FrontEndDevLibs]: false,
  [SuperBlocks.DataVis]: false,
  [SuperBlocks.BackEndDevApis]: false,
  [SuperBlocks.RelationalDb]: false,
  [SuperBlocks.QualityAssurance]: false,
  [SuperBlocks.SciCompPy]: false,
  [SuperBlocks.DataAnalysisPy]: false,
  [SuperBlocks.InfoSec]: false,
  [SuperBlocks.MachineLearningPy]: false,
  [SuperBlocks.CodingInterviewPrep]: false
};

interface CertificateEarnedProps {
  superBlock: SuperBlocks;
  user: User;
}

const CertificateEarned = (props: CertificateEarnedProps): JSX.Element => {
  const { superBlock, user } = props;

  // Update the values of certsMap with fetched user data
  switch (superBlock) {
    case SuperBlocks.RespWebDesign:
    case SuperBlocks.RespWebDesignNew:
      certsMap[superBlock] = user.isRespWebDesignCert;
      break;
    case SuperBlocks.JsAlgoDataStruct:
    case SuperBlocks.JsAlgoDataStructNew:
      certsMap[superBlock] = user.isJsAlgoDataStructCert;
      break;
    case SuperBlocks.FrontEndDevLibs:
      certsMap[superBlock] = user.isFrontEndLibsCert;
      break;
    case SuperBlocks.DataVis:
      certsMap[superBlock] = user.isDataVisCert;
      break;
    case SuperBlocks.BackEndDevApis:
      certsMap[superBlock] = user.isBackEndCert;
      break;
    case SuperBlocks.RelationalDb:
      certsMap[superBlock] = user.isRelationalDatabaseCertV8;
      break;
    case SuperBlocks.QualityAssurance:
      certsMap[superBlock] = user.isQaCertV7;
      break;
    case SuperBlocks.SciCompPy:
      certsMap[superBlock] = user.isSciCompPyCertV7;
      break;
    case SuperBlocks.DataAnalysisPy:
      certsMap[superBlock] = user.isDataAnalysisPyCertV7;
      break;
    case SuperBlocks.InfoSec:
      certsMap[superBlock] = user.isInfosecCertV7;
      break;
    case SuperBlocks.MachineLearningPy:
      certsMap[superBlock] = user.isMachineLearningPyCertV7;
      break;
    default:
      break;
  }

  return certsMap[superBlock] ? <CircleCheckRegular /> : <></>;
};

export default connect(mapStateToProps)(CertificateEarned);
