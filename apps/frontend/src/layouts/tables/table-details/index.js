import Footer from 'examples/Footer';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { useParams } from 'react-router-dom';

import TableColumns from './components/TableColumn';
import TableIndexes from './components/TableIndexes';

function TableDetails() {
    const { tableName } = useParams();

    return (
        <DashboardLayout>
            <DashboardNavbar />

            <TableColumns tableName={tableName} />
            <TableIndexes tableName={tableName} />

            <Footer />
        </DashboardLayout>
    );
}

export default TableDetails;
