import Footer from 'examples/Footer';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import KeyConstraints from './components/KeyConstraints';
import CheckConstraints from './components/CheckConstraints';

function Constraints() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <KeyConstraints />
            <CheckConstraints />
            <Footer />
        </DashboardLayout>
    );
}

export default Constraints;
