import React from 'react';

import * as ROUTES from '../../constants/routes';

const AccountNavBar = () => (
<ul className="nav aqua-gradient py-10 mb-40 font-weight-bold z-depth-1">
<li className="nav-item">
  <a className="nav-link active white-text" href={ROUTES.ACCOUNT}>Update Details</a>
</li>

<li className="nav-item">
  <a className="nav-link white-text" href={ROUTES.PASSWORD_UPDATE}>Update Password</a>
</li>

</ul>
);
export default AccountNavBar;
export {AccountNavBar};