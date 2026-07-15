import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

/**
 * Wraps every authenticated page. Renders the current route via <Outlet />,
 * reserves bottom space so content never sits under the fixed nav, and
 * always shows BottomNav so users can get back to Dashboard/Chat/etc.
 * from anywhere. Wire this into your router as the element for a parent
 * route that contains Dashboard, Reminders, MedicineLookup, Chat,
 * Notifications, and Profile as children — see integration note below.
 */
function Layout() {
  return (
    <div className="page-with-nav">
      <Outlet />
      <BottomNav />
    </div>
  );
}

export default Layout;
