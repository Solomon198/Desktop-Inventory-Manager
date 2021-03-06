/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg";
import { Dropdown } from "react-bootstrap";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl, checkIsActive } from "../../../_helpers";
import {
  DropdownItemToggler,
  DropdownMenu4
} from "../../../_partials/dropdowns";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
// import { checkIsActive } from '../../../../_helpers';
import './AsideSearchStyle.css'

export function AsideSearch({ isActive }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  return (
    // <div
    //   className={`tab-pane p-3 px-lg-7 py-lg-5 fade ${isActive &&
    //     'show active'}`}
    // >
    <div
      className={`menu-item ${getMenuItemActive("/e-commerce/customers")}`}
      aria-haspopup="true"
    >
      {/* begin::Form */}
      {/* <form className="p-2 p-lg-3">
        <div className="d-flex">
          <div className="input-icon h-40px">
            <input
              type="text"
              className="form-control form-control-lg form-control-solid h-40px"
              placeholder="Search..."
              id="generalSearch"
              autoComplete="false"
            />
            <span>
              <span className="svg-icon svg-icon-lg">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Search.svg")}
                />
              </span>
            </span>
          </div>

          <Dropdown drop="down" alignRight>
            <Dropdown.Toggle
              as={DropdownItemToggler}
              id="kt_quick_actions_search_toggle"
            >
              <OverlayTrigger
                placement="left"
                overlay={
                  <Tooltip id="quick-search-tooltip">Quick search</Tooltip>
                }
              >
                <a
                  href="#"
                  className="btn btn-icon btn-default btn-hover-primary ml-2 h-40px w-40px flex-shrink-0"
                >
                  <span className="svg-icon svg-icon-xl">
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/Code/Compiling.svg")}
                    />
                  </span>
                </a>
              </OverlayTrigger>
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim-up dropdown-menu-lg">
              <DropdownMenu4 />
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </form> */}
      {/* end::Form */}

      {/* <h3 className="p-2 p-lg-3 my-1 my-lg-3">Projects</h3> */}

      {/* begin::List */}

      {/* begin::Item */}
      <div className="list-item hoverable p-2 p-lg-3 mb-5">
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          <div className="symbol symbol-40 symbol-light mr-4">
            <span className="symbol-label bg-hover-white">
              <span className="svg-icon h-50 align-self-center">
                {/* <MonetizationOnIcon style={{ color: 'red', fontSize: '40px'}} /> */}
                <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-4-blocks.svg")} />
                {/* <img src={toAbsoluteUrl("/media/module-icons/sales.png")} className="align-self-center text-center" width="70%" /> */}
                {/* <img alt="sales" src={toAbsoluteUrl("/media/ecommerce/sales.png")} /> */}
              </span>
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className="d-flex flex-column flex-grow-1 mr-2">
            {/* <span className="text-dark-75 font-size-h6 mb-0">Sales</span> */}
            <NavLink className="menu-link" to="/dashboard">
              <i className="menu-bullet menu-bullet-dot">
                <span />
              </i>
              <span className="text-dark">
                <h6 className="text-dark">Dashboard</h6>
              </span>
            </NavLink>
            {/* <a
              href="#"
              className="text-muted text-hover-primary font-weight-bold"
            >
              By Ana
            </a> */}
          </div>
          {/* begin::End */}
        </div>
      </div>
      {/* end::Item */}

      <hr />

      {/* begin::Item */}
      <div className="list-item hoverable p-2 p-lg-3 mb-2">
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          <div className="symbol symbol-40 symbol-light mr-4">
            <span className="symbol-label bg-hover-white">
              <span className="svg-icon h-50 align-self-center">
                {/* <MonetizationOnIcon style={{ color: 'red', fontSize: '40px'}} /> */}
                {/* <SVG src={toAbsoluteUrl("/media/ecommerce/svg/sales1.svg")} /> */}
                <img src={toAbsoluteUrl("/media/module-icons/sales.png")} className="align-self-center text-center" width="70%" />
                {/* <img alt="sales" src={toAbsoluteUrl("/media/ecommerce/sales.png")} /> */}
              </span>
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className="d-flex flex-column flex-grow-1 mr-2">
            {/* <span className="text-dark-75 font-size-h6 mb-0">Sales</span> */}
            <NavLink className="menu-link" to="/e-commerce/sales">
              <i className="menu-bullet menu-bullet-dot">
                <span />
              </i>
              <span className="text-dark nav-link-text">
                <h6 className="nav-link-text">Sales</h6>
              </span>
            </NavLink>
            {/* <a
              href="#"
              className="text-muted text-hover-primary font-weight-bold"
            >
              By Ana
            </a> */}
          </div>
          {/* begin::End */}
        </div>
      </div>
      {/* end::Item */}

      {/* begin::Item */}
      <div className="list-item hoverable p-2 p-lg-3 mb-2">
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          <div className="symbol symbol-40 symbol-light mr-4">
            <span className="symbol-label bg-hover-white">
              <span className="svg-icon h-50 align-self-center">
              {/* <SVG src={toAbsoluteUrl("/media/ecommerce/svg/product2.svg")} /> */}
              <img src={toAbsoluteUrl("/media/module-icons/products.png")} className="align-self-center text-center" width="70%" />
              </span>
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className="d-flex flex-column flex-grow-1 mr-2">
            {/* <span className="text-dark-75 font-size-h6 mb-0">Products</span> */}

            <NavLink className="menu-link" to="/e-commerce/products">
              <i className="menu-bullet menu-bullet-dot">
                <span />
              </i>
              <span className="text-dark nav-link-text">
                <h6 className="nav-link-text">Products</h6>
              </span>
            </NavLink>
            {/* <a
              href="#"
              className="text-muted text-hover-primary font-weight-bold"
            >
              By James
            </a> */}
          </div>
          {/* begin::End */}
        </div>
      </div>
      {/* end::Item */}

      

      {/* begin::Item */}
      <div className="list-item hoverable p-2 p-lg-3 mb-2">
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          <div className="symbol symbol-40 symbol-light mr-4">
            <span className="symbol-label bg-hover-white">
              <span className="svg-icon h-50 align-self-center">
                {/* <SVG src={toAbsoluteUrl("/media/svg/misc/006-plurk.svg")} /> */}
                <img src={toAbsoluteUrl("/media/module-icons/stocks.png")} className="align-self-center text-center" width="70%" />
              </span>
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className="d-flex flex-column flex-grow-1 mr-2">
            {/* <span className="text-dark-75 font-size-h6 mb-0">Products</span> */}

            <NavLink className="menu-link" to="/e-commerce/stocks-entry">
              <i className="menu-bullet menu-bullet-dot">
                <span />
              </i>
              <span className="text-dark nav-link-text">
                <h6 className="nav-link-text">Stocks</h6>
              </span>
            </NavLink>
            {/* <a
              href="#"
              className="text-muted text-hover-primary font-weight-bold"
            >
              By James
            </a> */}
          </div>
          {/* begin::End */}
        </div>
      </div>
      {/* end::Item */}

      {/* begin::Item */}
      <div className="list-item hoverable p-2 p-lg-3 mb-2">
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          <div className="symbol symbol-40 symbol-light mr-4">
            <span className="symbol-label bg-hover-white">
              <span className="svg-icon h-50 align-self-center">
                {/* <SVG src={toAbsoluteUrl("/media/ecommerce/svg/stock-history.svg")} /> */}
                <img src={toAbsoluteUrl("/media/module-icons/stock-history.png")} className="align-self-center text-center" width="70%" />
              </span>
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className="d-flex flex-column flex-grow-1 mr-2">
            {/* <span className="text-dark-75 font-size-h6 mb-0">Products</span> */}

            <NavLink className="menu-link" to="/e-commerce/stocks">
              <i className="menu-bullet menu-bullet-dot">
                <span />
              </i>
              <span className="text-dark nav-link-text">
                <h6 className="nav-link-text">Stocks History</h6>
              </span>
            </NavLink>
            {/* <a
              href="#"
              className="text-muted text-hover-primary font-weight-bold"
            >
              By James
            </a> */}
          </div>
          {/* begin::End */}
        </div>
      </div>
      {/* end::Item */}

      {/* begin::Item */}
      <div className="list-item hoverable p-2 p-lg-3 mb-2">
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          <div className="symbol symbol-40 symbol-light mr-4">
            <span className="symbol-label bg-hover-white">
              <span className="svg-icon h-50 align-self-center">
                {/* <SVG src={toAbsoluteUrl("/media/ecommerce/svg/stock-history.svg")} /> */}
                <img src={toAbsoluteUrl("/media/module-icons/unit-manager.png")} className="align-self-center text-center" width="70%" />
              </span>
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className="d-flex flex-column flex-grow-1 mr-2">

            <NavLink className="menu-link" to="/e-commerce/units">
              <i className="menu-bullet menu-bullet-dot">
                <span />
              </i>
              <span className="text-dark nav-link-text">
                <h6 className="nav-link-text">Unit Manager</h6>
              </span>
            </NavLink>
          </div>
          {/* begin::End */}
        </div>
      </div>
      {/* end::Item */}

      {/* begin::Item */}
      <div className="list-item hoverable p-2 p-lg-3 mb-2">
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          <div className="symbol symbol-40 symbol-light mr-4">
            <span className="symbol-label bg-hover-white">
              <span className="svg-icon h-50 align-self-center">
                {/* <SVG
                  src={toAbsoluteUrl("/media/ecommerce/svg/customer2.svg")}
                /> */}
                <img src={toAbsoluteUrl("/media/module-icons/customers.png")} className="align-self-center text-center" width="70%" />
              </span>
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className="d-flex flex-column flex-grow-1 mr-2">
            {/* <span className="text-dark-75 font-size-h6 mb-0">Customers</span> */}

            <NavLink className="menu-link" to="/e-commerce/customers">
              <i className="menu-bullet menu-bullet-dot">
                <span />
              </i>
              <span className="text-dark nav-link-text">
                <h6 className="nav-link-text">Customers</h6>
              </span>
            </NavLink>

            {/* <a
              href="#"
              className="text-muted text-hover-primary font-weight-bold"
            >
              By CRA Team
            </a> */}
          </div>
          {/* begin::End */}
        </div>
      </div>
      {/* end::Item */}

      {/* begin::Item */}
      <div className="list-item hoverable p-2 p-lg-3 mb-2">
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          <div className="symbol symbol-40 symbol-light mr-4">
            <span className="symbol-label bg-hover-white">
              <span className="svg-icon h-50 align-self-center">
                {/* <SVG
                  src={toAbsoluteUrl("/media/ecommerce/svg/employee.svg")}
                /> */}
                <img src={toAbsoluteUrl("/media/module-icons/employees.png")} className="align-self-center text-center" width="70%" />
              </span>
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <NavLink className="menu-link" to="/e-commerce/employees">
            <i className="menu-bullet menu-bullet-dot">
              <span />
            </i>
            <span className="text-dark nav-link-text">
              <h6 className="nav-link-text">Employees</h6>
            </span>
          </NavLink>
          {/* <div className="d-flex flex-column flex-grow-1 mr-2">
            <span className="text-dark-75 font-size-h6 mb-0">Employees</span> */}
          {/* <a
              href="#"
              className="text-muted text-hover-primary font-weight-bold"
            >
              By iC Team
            </a> */}
          {/* </div> */}
          {/* begin::End */}
        </div>
      </div>
      {/* end::Item */}

      {/* begin::Item */}
      <div className="list-item hoverable p-2 p-lg-3 mb-2">
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          <div className="symbol symbol-40 symbol-light mr-4">
            <span className="symbol-label bg-hover-white">
              <span className="svg-icon h-50 align-self-center">
                {/* <SVG src={toAbsoluteUrl("/media/ecommerce/svg/expenses.svg")} /> */}
                <img src={toAbsoluteUrl("/media/module-icons/expense.png")} className="align-self-center text-center" width="70%" />
              </span>
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className="d-flex flex-column flex-grow-1 mr-2">
            {/* <span className="text-dark-75 font-size-h6 mb-0">Expenses</span> */}
            <NavLink className="menu-link" to="/e-commerce/expenses">
              <i className="menu-bullet menu-bullet-dot">
                <span />
              </i>
              <span className="text-dark nav-link-text">
                <h6 className="nav-link-text">Expenses</h6>
              </span>
            </NavLink>
            {/* <a
              href="#"
              className="text-muted text-hover-primary font-weight-bold"
            >
              By PV Inc.
            </a> */}
          </div>
          {/* begin::End */}
        </div>
      </div>
      {/* end::Item */}

      {/* begin::Item */}
      <div className="list-item hoverable p-2 p-lg-3 mb-2">
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          <div className="symbol symbol-40 symbol-light mr-4">
            <span className="symbol-label bg-hover-white">
              <span className="svg-icon h-50 align-self-center">
                {/* <SVG src={toAbsoluteUrl("/media/ecommerce/svg/debt.svg")} /> */}
                <img src={toAbsoluteUrl("/media/module-icons/debts.png")} className="align-self-center text-center" width="70%" />
              </span>
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className="d-flex flex-column flex-grow-1 mr-2">
            {/* <span className="text-dark-75 font-size-h6 mb-0">Debt Manager</span> */}
            <NavLink className="menu-link" to="/e-commerce/debts-manager">
              <i className="menu-bullet menu-bullet-dot">
                <span />
              </i>
              <span className="text-dark nav-link-text">
                <h6 className="nav-link-text">Debts Manager</h6>
              </span>
            </NavLink>
            {/* <a
              href="#"
              className="text-muted text-hover-primary font-weight-bold"
            >
              By Plurk Team.
            </a> */}
          </div>
          {/* begin::End */}
        </div>
      </div>
      {/* end::Item */}

      {/* begin::Item */}
      <div className="list-item hoverable p-2 p-lg-3 mb-2">
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          <div className="symbol symbol-40 symbol-light mr-4">
            <span className="symbol-label bg-hover-white">
              <span className="svg-icon h-50 align-self-center">
                {/* <SVG src={toAbsoluteUrl("/media/ecommerce/svg/debt.svg")} /> */}
                <img src={toAbsoluteUrl("/media/module-icons/supplier.png")} className="align-self-center text-center" width="70%" />
              </span>
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className="d-flex flex-column flex-grow-1 mr-2">
            {/* <span className="text-dark-75 font-size-h6 mb-0">Debt Manager</span> */}
            <NavLink className="menu-link" to="/e-commerce/suppliers">
              <i className="menu-bullet menu-bullet-dot">
                <span />
              </i>
              <span className="text-dark nav-link-text">
                <h6 className="nav-link-text">Suppliers</h6>
              </span>
            </NavLink>
            {/* <a
              href="#"
              className="text-muted text-hover-primary font-weight-bold"
            >
              By Plurk Team.
            </a> */}
          </div>
          {/* begin::End */}
        </div>
      </div>
      {/* end::Item */}

      {/* begin::Item */}
      <div className="list-item hoverable p-2 p-lg-3 mb-2">
        <div className="d-flex align-items-center">
          {/* begin::Symbol */}
          <div className="symbol symbol-40 symbol-light mr-4">
            <span className="symbol-label bg-hover-white">
              <span className="svg-icon h-50 align-self-center">
                {/* <SVG src={toAbsoluteUrl("/media/ecommerce/svg/debt.svg")} /> */}
                <img src={toAbsoluteUrl("/media/module-icons/supplier.png")} className="align-self-center text-center" width="70%" />
              </span>
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className="d-flex flex-column flex-grow-1 mr-2">
            {/* <span className="text-dark-75 font-size-h6 mb-0">Debt Manager</span> */}
            <NavLink className="menu-link" to="/e-commerce/roles">
              <i className="menu-bullet menu-bullet-dot">
                <span />
              </i>
              <span className="text-dark nav-link-text">
                <h6 className="nav-link-text">Roles</h6>
              </span>
            </NavLink>
            {/* <a
              href="#"
              className="text-muted text-hover-primary font-weight-bold"
            >
              By Plurk Team.
            </a> */}
          </div>
          {/* begin::End */}
        </div>
      </div>
      {/* end::Item */}

      {/* end::List */}
    </div>
  );
}
