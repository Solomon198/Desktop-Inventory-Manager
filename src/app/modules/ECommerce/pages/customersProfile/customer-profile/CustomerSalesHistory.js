/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";

export function CustomerSalesHistory({ className }) {
  return (
    <>
      {/* begin::Advance Table Widget 9 */}
      <div className={`card card-custom ${className}`}>
        {/* begin::Header */}
        <div className="card-header border-0 py-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label font-weight-bolder text-dark">
              Sales History
            </span>
          </h3>
        </div>
        {/* end::Header */}

        {/* begin::Body */}
        <div className="card-body pt-0 pb-3">
          <div className="tab-content">
            {/* begin::Table */}
            <div className="table-responsive">
              <table className="table table-head-custom table-vertical-center table-head-bg table-borderless">
                <thead>
                  <tr className="text-left">
                    <th style={{ minWidth: "250px" }} className="pl-7">
                      <span className="text-dark-75">products</span>
                    </th>
                    <th style={{ minWidth: "120px" }}>
                      <span className="text-dark-75">quantity</span>
                    </th>
                    <th style={{ minWidth: "100px" }}>
                      <span className="text-dark-75">total amount</span>
                    </th>
                    <th style={{ minWidth: "100px" }}>
                      <span className="text-dark-75">date</span>
                    </th>
                    <th style={{ minWidth: "100px" }} />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pl-0 py-8">
                      <div className="d-flex align-items-center">
                        <div>
                          <span className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                            Brad Simmons
                          </span>
                          <span className="text-muted font-weight-bold d-block">
                            HTML, JS, ReactJS
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                        $8,000,000
                      </span>
                      <span className="text-muted font-weight-bold">
                        In Proccess
                      </span>
                    </td>
                    <td>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                        $520
                      </span>
                      <span className="text-muted font-weight-bold">Paid</span>
                    </td>
                    <td>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                        Intertico
                      </span>
                      <span className="text-muted font-weight-bold">
                        Web, UI/UX Design
                      </span>
                    </td>
                    <td className="pr-0 text-right">
                      <a
                        href="#"
                        className="btn btn-light-success font-weight-bolder font-size-sm"
                      >
                        View Offer
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* end::Table */}
          </div>
        </div>
        {/* end::Body */}
      </div>
      {/* end::Advance Table Widget 9 */}
    </>
  );
}
