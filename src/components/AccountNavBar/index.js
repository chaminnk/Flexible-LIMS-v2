import React from 'react';

import * as ROUTES from '../../constants/routes';

const AccountNavBar = () => (
<ul class="nav aqua-gradient py-10 mb-40 font-weight-bold z-depth-1">
<li class="nav-item">
  <a class="nav-link active white-text" href={ROUTES.ACCOUNT}>Update Details</a>
</li>
<li class="nav-item">
  <a class="nav-link white-text" href={ROUTES.PASSWORD_FORGET}>Change password from Email</a>
</li>
<li class="nav-item">
  <a class="nav-link white-text" href={ROUTES.PASSWORD_UPDATE}>Update Password</a>
</li>

</ul>
);
export default AccountNavBar;
export {AccountNavBar};