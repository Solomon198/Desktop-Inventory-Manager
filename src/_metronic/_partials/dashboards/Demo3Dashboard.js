import React from "react";
import {
  MixedWidget4,
  BaseTablesWidget1,
  BaseTablesWidget2,
  BaseTablesWidget6,
  StatsWidget11,
  StatsWidget10,
  ListsWidget8,
  ListsWidget10,
  ListsWidget14,
  AdvanceTablesWidget9
} from "../widgets";
import AdminChart1 from "./adminDashboard/AdminChart1";
import AdminChart3 from "./adminDashboard/admin-chart-3/AdminChart3";
import AdminChart4 from "./adminDashboard/AdminChart4";
import AdminChart5 from "./adminDashboard/AdminChart5";
import AdminChart6 from "./adminDashboard/AdminChart6";

export function Demo3Dashboard() {
  return (
    <>
      {/* begin::Dashboard */}

      {/* begin::Row */}
      <div className="row mb-5">
        <div className="col-xl-12 mb-5">
          <AdminChart3 />
        </div>
        
        <div className="col-xl-12">
          <AdminChart1 />
          {/* <MixedWidget4 className="gutter-b card-stretch" /> */}
        </div>

        <div className="col-xl-12">
          <AdminChart4 />
          {/* <MixedWidget4 className="gutter-b card-stretch" /> */}
        </div>

        <div className="col-xl-12">
          <AdminChart5 />
          {/* <MixedWidget4 className="gutter-b card-stretch" /> */}
        </div>

        <div className="col-xl-12">
          <AdminChart6 />
          {/* <MixedWidget4 className="gutter-b card-stretch" /> */}
        </div>
        {/* <div className="col-xl-8">
          <BaseTablesWidget6 className="gutter-b" />
        </div> */}
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className="row">
        <div className="col-xl-12">
          <div className="row">
            {/* <div className="col-xl-12">
              <StatsWidget10
                className="gutter-b"
                symbolShape="circle"
                baseColor="info"
              />
            </div> */}
          </div>
        </div>
        {/* <div className="col-xl-8">
          <ListsWidget14 className="gutter-b card-stretch" />
        </div> */}
      </div>
      {/* end::Row */}

      {/* begin::Row */}
      {/* <div className="row">
        <div className="col-lg-12 col-xxl-12">
          <AdvanceTablesWidget9 className="card-stretch gutter-b" />
        </div>
      </div> */}
      {/* end::Row */}

      {/* begin::Row */}
      {/* <div className="row">
        <div className="col-xl-6">
          <ListsWidget10 className="card-stretch gutter-b" />
        </div>
        <div className="col-xl-6">
          <BaseTablesWidget1 className="card-stretch gutter-b" />
        </div>
      </div> */}
      {/* end::Row */}

      {/* begin::Row */}
      {/* <div className="row">
        <div className="col-lg-4">
          <ListsWidget8 className="card-stretch gutter-b" />
        </div>
        <div className="col-lg-8">
          <BaseTablesWidget2 className="card-stretch gutter-b" />
        </div>
      </div> */}
      {/* end::Row */}

      {/* end::Dashboard */}
    </>
  );
}
