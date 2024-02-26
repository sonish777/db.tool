// Material Dashboard 2 React layouts
import Dashboard from 'layouts/dashboard';
import Tables from 'layouts/tables';
import Billing from 'layouts/billing';
import RTL from 'layouts/rtl';
import Notifications from 'layouts/notifications';
import Profile from 'layouts/profile';
import SignIn from 'layouts/authentication/sign-in';
import SignUp from 'layouts/authentication/sign-up';

// @mui icons
import Icon from '@mui/material/Icon';

const routes = [
    {
        type: 'collapse',
        name: 'Dashboard',
        key: 'dashboard',
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: '/dashboard',
        isPrivate: true,
        component: <Dashboard />,
    },
    {
        type: 'collapse',
        name: 'Tables',
        key: 'tables',
        icon: <Icon fontSize="small">table_view</Icon>,
        route: '/tables',
        isPrivate: true,
        component: <Tables />,
    },
    {
        type: 'collapse',
        name: 'Columns',
        key: 'columns',
        icon: <Icon fontSize="small">receipt_long</Icon>,
        route: '/billing',
        isPrivate: true,
        component: <Billing />,
    },
    {
        type: 'collapse',
        name: 'Constraints',
        key: 'constraints',
        icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
        route: '/rtl',
        isPrivate: true,
        component: <RTL />,
    },
    {
        type: 'collapse',
        name: 'Profile',
        key: 'profile',
        icon: <Icon fontSize="small">person</Icon>,
        route: '/profile',
        isPrivate: true,
        component: <Profile />,
    },
    {
        type: 'collapse',
        name: 'Sign In',
        key: 'sign-in',
        icon: <Icon fontSize="small">login</Icon>,
        route: '/authentication/connect',
        isPrivate: false,
        component: <SignIn />,
    },
];

export default routes;
