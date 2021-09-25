import React from 'react';
import { toAbsoluteUrl } from '../../../../../../_metronic/_helpers';
import { Typography, Avatar } from '@material-ui/core';

export const BusinessAccount = () => {
  const businessAccountContainer = {
    boxShadow: ' -1px 7px 17px -13px rgba(0,0,0,0.75)',
    borderRadius: '10px',
    marginTop: '40px',
    width: '500px',
    minHeight: '350px',
  };
  return (
    <>
      <div
        style={businessAccountContainer}
        className="container d-flex justify-content-center"
      >
        <div>
          <div className="" style={{ width: '100%' }}>
            <Avatar
              alt="Business Logo"
              src={`${toAbsoluteUrl('/media/logos/dixre-logo.jpg')}`}
              style={{
                width: '150px',
                height: '150px',
                marginTop: '20px',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: '0px',
              }}
            />

            <Typography
              style={{
                fontSize: '28px',
                textAlign: 'center',
                marginTop: '20px',
                color: '#000',
                fontWeight: '500',
              }}
              variant="h1"
              component="div"
              gutterBottom
            >
              Dixre Enterprise
            </Typography>
            <span className="text-muted">
              <i
                style={{
                  display: 'block',
                  fontSize: '12px',
                  marginTop: '-10px',
                }}
              >
                building a reputation for Information Technology in Africa...
              </i>
            </span>
          </div>
          <hr />

          <div style={{ marginTop: '25px' }}>
            {/* <Link to="/user-profile" className="navi-item px-8 cursor-pointer"> */}
            <div className="d-flex my-5">
              <div className="navi-icon mr-2">
                <i className="flaticon2-phone text-primary" />
              </div>
              <div className="navi-text">
                <div className="font-weight-bold cursor-pointer">
                  Business Phone Number
                </div>
                <div className="text-muted">
                  <span>+234 89 456 287 98</span>
                </div>
              </div>
            </div>
            {/* </Link> */}

            {/* <a className="navi-item px-8"> */}
            <div className="d-flex mb-5">
              <div className="navi-icon mr-2">
                <i className="flaticon2-mail text-warning"></i>
              </div>
              <div className="navi-text">
                <div className="font-weight-bold">Business Email Address</div>
                <div className="text-muted">dixreenterprise@gmail.com</div>
              </div>
            </div>
            {/* </a> */}

            <div className="d-flex mb-5">
              <div className="navi-icon mr-2">
                <i className="flaticon2-calendar-3 text-danger"></i>
              </div>
              <div className="navi-text">
                <div className="font-weight-bold">Office Address</div>
                <div className="text-muted">GF1 Nasara plaza</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
