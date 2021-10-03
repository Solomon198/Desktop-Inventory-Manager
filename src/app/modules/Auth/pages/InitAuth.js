/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Link, Switch, Redirect } from 'react-router-dom';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { toAbsoluteUrl } from '../../../../_metronic/_helpers';
// import { ContentRoute } from '../../../../_metronic/layout';
// import Login from './Login';
// import Registration from './Registration';
// import ForgotPassword from './ForgotPassword';
import '../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss';
import ButtonAppBar from './app-bar/AppBar';
import { Typography, Button } from '@material-ui/core';
import * as auth from '../_redux/authRedux';
import { connectAcct } from '../_redux/authCrud';

const initialValues = {
  businessName: 'dixre',
};

function InitAuth(props) {
  const [loading, setLoading] = useState(false);
  const InitAuthSchema = Yup.object().shape({
    businessName: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Business Name is required'),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return 'is-invalid';
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return 'is-valid';
    }

    return '';
  };

  const formik = useFormik({
    initialValues,
    validationSchema: InitAuthSchema,
    onSubmit: (values, { setSubmitting }) => {
      enableLoading();
      setTimeout(() => {
        connectAcct(values.businessName)
          .then(({ data: { accessToken } }) => {
            disableLoading();
            props.connectAcct(accessToken);
          })
          .catch(() => {
            disableLoading();
            setSubmitting(false);
          });
      }, 1000);
    },
  });

  // const handleConnect = values => {
  //   enableLoading();
  //   setTimeout(() => {
  //     connectAcct(values.businessName)
  //       .then(({ data: { accessToken } }) => {
  //         disableLoading();
  //         props.connectAcct(accessToken);
  //       })
  //       .catch(() => {
  //         disableLoading();
  //       });
  //   }, 1000);
  // };

  return (
    <>
      <div
        style={{
          width: '700px',
          marginTop: 0,
          marginBottom: 0,
          marginRight: 'auto',
          marginLeft: 'auto',
        }}
      >
        <Typography
          variant="h3"
          style={{
            color: '#000',
            fontWeight: '500',
            marginBottom: '20px',
          }}
          sx={{ flexGrow: 1 }}
        >
          Log in to your Business Account
        </Typography>
        <Typography
          className="text-muted"
          style={{
            fontSize: '16px',
            lineHeight: '150%',
            marginBottom: '40px',
          }}
        >
          Enter your Business portal name below. Once connected, you can log in
          with the same credentials that you used while setting your Business
          account.
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <div className="input-group input-group-lg mb-3">
            <div className="input-group-prepend">
              <span
                style={{ backgroundColor: '#f9f9f9' }}
                className="input-group-text"
                id="basic-addon3"
              >
                https://dixre.com/inventory/
              </span>
            </div>
            <input
              style={{ outlineColor: '#b00' }}
              type="text"
              name="businessName"
              placeholder="Enter your business name"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                'email'
              )}`}
              id="basic-url"
              aria-describedby="basic-addon3"
              {...formik.getFieldProps('businessName')}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.email}</div>
              </div>
            ) : null}
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              // startIcon={<LoginIcon style={{ color: '#fff' }} />}
              style={{
                backgroundColor: '#b00',
                color: '#fff',
                textTransform: 'uppercase',
                marginLeft: '5px',
              }}
            >
              <span>connect</span>
              {loading && <span className="ml-3 spinner spinner-white"></span>}
            </Button>
          </div>
        </form>

        <div className="d-flex justify-content-between">
          <Link to="/auth/registration">
            <Typography style={{ color: '#b00' }}>
              <span className="text-dark">Don't have an account?</span>{' '}
              <span style={{ color: '#b00', fontWeight: '500' }}>
                Get started now
              </span>
            </Typography>
          </Link>
          <Link to="/">
            <Typography>
              <span className="text-dark">
                Can't remember your portal name?
              </span>{' '}
              <span style={{ color: '#b00', fontWeight: '500' }}>
                Click here
              </span>
            </Typography>
          </Link>
        </div>
      </div>
    </>
  );
}

export default injectIntl(connect(null, auth.actions)(InitAuth));
