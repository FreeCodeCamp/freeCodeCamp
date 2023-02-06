import { WindowLocation } from '@gatsbyjs/reach-router';
import { i18nConstants } from '../../../shared/config/constants';

const splitPath = (pathname: string): string[] =>
  pathname.split('/').filter(x => x);

export const isLanding = (pathname: string): boolean => {
  const pathArray = splitPath(pathname);
  const isEnglishLanding = pathArray.length === 0;
  const isI18Landing =
    pathArray.length === 1 && i18nConstants.includes(pathArray[0]);
  return isEnglishLanding || isI18Landing;
};

export const isLocationSuperBlock = (
  location: WindowLocation | undefined
): boolean => {
  return /^\/learn\/[\w-]+\/$/.test(location?.pathname ?? '');
};
