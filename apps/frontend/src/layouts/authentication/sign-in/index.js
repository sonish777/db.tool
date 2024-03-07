import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

// Authentication layout components
import BasicLayout from 'layouts/authentication/components/BasicLayout';

// Images
import bgImage from 'assets/images/bg-sign-in-basic.jpeg';
import { useState } from 'react';
import { useAuthContext } from 'context/auth';
import MDSnackbar from 'components/MDSnackbar';

function Basic() {
    const authContext = useAuthContext();
    const [formData, setFormData] = useState({
        host: '',
        port: '',
        username: '',
        password: '',
        databaseName: '',
    });
    const [formError, setFormError] = useState({
        host: '',
        port: '',
        username: '',
        password: '',
        databaseName: '',
    });
    const [successSB, setSuccessSB] = useState(false);
    const [errorSB, setErrorSB] = useState(false);
    const closeSuccessSB = () => setSuccessSB(false);
    const closeErrorSB = () => setErrorSB(false);
    const onInputChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const resetFormError = () =>
        setFormError({
            host: '',
            port: '',
            username: '',
            password: '',
            databaseName: '',
        });
    const onSubmitHandler = async () => {
        try {
            resetFormError();
            const resp = await authContext.login(formData);
            if (resp.status === 'error') {
                setErrorSB(true);
                const error = resp.data.error;
                if (error.statusCode === 422) {
                    const tempFormError = {};
                    error.detail.forEach((err) => {
                        tempFormError[err.field] = err.errors.pop() || '';
                    });
                    setFormError(tempFormError);
                }
            } else {
                setSuccessSB(true);
            }
        } catch (error) {
            setErrorSB(true);
        }
    };
    return (
        <BasicLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                    mx={2}
                    mt={-3}
                    p={2}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography
                        variant="h4"
                        fontWeight="medium"
                        color="white"
                        mt={1}
                    >
                        Connect Database
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Host"
                                fullWidth
                                name="host"
                                onChange={onInputChangeHandler}
                                error={!!formError.host}
                                helperText={formError.host || ''}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="number"
                                label="Port"
                                fullWidth
                                name="port"
                                onChange={onInputChangeHandler}
                                error={!!formError.port}
                                helperText={formError.port || ''}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Username"
                                fullWidth
                                name="username"
                                onChange={onInputChangeHandler}
                                error={!!formError.username}
                                helperText={formError.username || ''}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="password"
                                label="Password"
                                fullWidth
                                name="password"
                                onChange={onInputChangeHandler}
                                error={!!formError.password}
                                helperText={formError.password || ''}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="text"
                                label="Database"
                                fullWidth
                                name="databaseName"
                                onChange={onInputChangeHandler}
                                error={!!formError.databaseName}
                                helperText={formError.databaseName || ''}
                            />
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton
                                variant="gradient"
                                color="info"
                                fullWidth
                                onClick={onSubmitHandler}
                            >
                                Connect
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>

            <MDSnackbar
                color="success"
                icon="check"
                title="Login Success"
                content="Redirecting to Dashboard..."
                open={successSB}
                dateTime=""
                onClose={closeSuccessSB}
                close={closeSuccessSB}
            />

            <MDSnackbar
                color="error"
                icon="warning"
                title="Login Failed"
                content="Invalid database credentials!"
                open={errorSB}
                dateTime=""
                close={closeErrorSB}
                onClose={closeErrorSB}
            />
        </BasicLayout>
    );
}

export default Basic;
