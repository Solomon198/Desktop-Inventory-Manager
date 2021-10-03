/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { ViewAgenda } from "@material-ui/icons";

export const ActionsColumnFormatter = (
  cellContent,
  row,
  rowIndex,
  { openEditSalePage, openDeleteSaleDialog, viewCustomerProfileButtonClick }
) => (
  <>
    <div className="d-flex">
      <a
        title="View Debt Info"
        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
        onClick={() => {
          openEditSalePage(row._id);
        }}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <ViewAgenda />
          {/* <SVG
            src={toAbsoluteUrl('/media/svg/icons/Communication/Write.svg')}
          /> */}
        </span>
      </a>

      <a
        title="Show customer profile"
        className="btn btn-icon btn-light btn-hover-info ml-1 btn-sm mx-3"
        onClick={() => {
          viewCustomerProfileButtonClick(row.customer_id);
        }}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <VisibilityIcon />
          {/* <SVG
            src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
          /> */}
        </span>
      </a>
    </div>
    <> </>

    {/* <OverlayTrigger
      overlay={<Tooltip id="products-delete-tooltip">Delete product</Tooltip>}
    >
      <a
        className="btn btn-icon btn-light btn-hover-danger btn-sm"
        onClick={() => openDeleteSaleDialog(row._id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-danger">
          <SVG src={toAbsoluteUrl('/media/svg/icons/General/Trash.svg')} />
        </span>
      </a>
    </OverlayTrigger> */}
  </>
);
