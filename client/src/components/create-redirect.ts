import { navigate } from 'gatsby';
import type { RouteComponentProps } from '@gatsbyjs/reach-router';

const createRedirect =
  (to = '/'): ((_props: RouteComponentProps) => JSX.Element | null) =>
  () => {
    if (typeof window !== 'undefined') {
      void navigate(to);
    }
    return null;
  };

export default createRedirect;
