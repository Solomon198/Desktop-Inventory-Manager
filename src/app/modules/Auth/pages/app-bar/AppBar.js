import * as React from 'react';
import { Typography, Button, Link } from '@material-ui/core';
import PhoneIcon from '@material-ui/icons/Phone';
import './AppBar.css';

export default function AppBar() {
  return (
    <div>
      <div
        style={{
          backgroundColor: '#fff',
          position: 'static',
          padding: '25px',
        }}
      >
        <div className="d-flex justify-content-between">
          <Link to="/">
            <Typography
              className="heading-text"
              variant="h4"
              component="div"
              style={{ color: '#000', fontWeight: '500' }}
              sx={{ flexGrow: 1 }}
            >
              Dixre
            </Typography>
          </Link>
          {/* <Button
            className="btn-tel"
            // color="inherit"
            startIcon={<PhoneIcon style={{ color: '#b00' }} />}
          >
            <a
              href="tel:07081785091"
              className="text-muted"
              style={{ fontSize: '16px' }}
            >
              +234 90 812 343 45
            </a>
          </Button> */}
        </div>
      </div>
    </div>
  );
}
