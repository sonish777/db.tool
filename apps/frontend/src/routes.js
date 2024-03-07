// Material Dashboard 2 React layouts
import Dashboard from 'layouts/dashboard';
import Tables from 'layouts/tables';
import Profile from 'layouts/profile';
import SignIn from 'layouts/authentication/sign-in';

// @mui icons
import Icon from '@mui/material/Icon';
import Columns from 'layouts/columns';
import TableDetails from 'layouts/tables/table-details';
import Constraints from 'layouts/constraints';

const routes = [
    {
        type: 'collapse',
        name: 'Dashboard',
        key: 'dashboard',
        icon: <Icon fontSize="small">dashboard</Icon>,
        sideNavEl: true,
        route: '/dashboard',
        isPrivate: true,
        component: <Dashboard />,
    },
    {
        type: 'collapse',
        name: 'Tables',
        key: 'tables',
        icon: <Icon fontSize="small">table_view</Icon>,
        sideNavEl: true,
        route: '/tables',
        isPrivate: true,
        component: <Tables />,
    },
    {
        type: 'collapse',
        name: 'Columns',
        key: 'columns',
        icon: <Icon fontSize="small">receipt_long</Icon>,
        sideNavEl: true,
        route: '/columns',
        isPrivate: true,
        component: <Columns />,
    },
    {
        type: 'collapse',
        name: 'Table Columns',
        key: 'table-columns',
        icon: null,
        sideNavEl: false,
        route: '/tables/:tableName',
        isPrivate: true,
        component: <TableDetails />,
    },
    {
        type: 'collapse',
        name: 'Constraints',
        key: 'constraints',
        icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
        sideNavEl: true,
        route: '/constraints',
        isPrivate: true,
        component: <Constraints />,
    },
    {
        type: 'collapse',
        name: 'Profile',
        key: 'profile',
        icon: <Icon fontSize="small">person</Icon>,
        sideNavEl: true,
        route: '/profile',
        isPrivate: true,
        component: <Profile />,
    },
    {
        type: 'collapse',
        name: 'Sign In',
        key: 'sign-in',
        icon: <Icon fontSize="small">login</Icon>,
        sideNavEl: true,
        route: '/authentication/connect',
        isPrivate: false,
        component: <SignIn />,
    },
];

export default routes;
