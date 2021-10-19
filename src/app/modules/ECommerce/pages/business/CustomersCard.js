/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,no-undef */
import React, { useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../_metronic/_partials/controls';
import SVG from 'react-inlinesvg';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import { BusinessAccount } from './business-account/BusinessAccount';
import { useCustomersUIContext } from './CustomersUIContext';
import RolesAccessLayer from './roles-access-layer/RolesAccessLayer';

export function CustomersCard() {
  const customersUIContext = useCustomersUIContext();
  const customersUIProps = useMemo(() => {
    return {
      ids: customersUIContext.ids,
      newCustomerButtonClick: customersUIContext.newCustomerButtonClick,
    };
  }, [customersUIContext]);
  const [selectedTab, setSelectedTab] = useState('AuditLogs');
  const [key, setKey] = useState('basicInfo');

  const setTab = (_tabName) => {
    setSelectedTab(_tabName);
  };

  return (
    <>
      <Card>
        <CardHeader title="Business Account">
          <CardHeaderToolbar>
            <button
              type="button"
              className="btn btn-primary"
              onClick={customersUIProps.newCustomerButtonClick}
            >
              Edit Business Account
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="basicInfo" title="Basic Info">
              <div className="d-flex justify-content-center">
                <BusinessAccount />
              </div>
            </Tab>
            <Tab eventKey="roles" title="Roles">
              <RolesAccessLayer />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
}
