import { useEffect } from 'react';
import { useLocation, globalHistory } from '@gatsbyjs/reach-router';

interface Props {
  onWindowClose: (event: BeforeUnloadEvent) => void;
  onHistoryChange: () => void;
}

export const usePageLeave = ({ onWindowClose, onHistoryChange }: Props) => {
  const curLocation = useLocation();

  useEffect(() => {
    window.addEventListener('beforeunload', onWindowClose);

    // This is a workaround as @gatsbyjs/reach-router doesn't support blocking history change.
    // https://github.com/reach/router/issues/464
    const unlistenHistory = globalHistory.listen(({ action, location }) => {
      const isBack = action === 'POP';
      const isRouteChanged =
        action === 'PUSH' && location.pathname !== curLocation.pathname;

      if (isBack || isRouteChanged) {
        onHistoryChange();
      }
    });

    return () => {
      window.removeEventListener('beforeunload', onWindowClose);
      unlistenHistory();
    };
  }, [onWindowClose, onHistoryChange, curLocation]);
};
