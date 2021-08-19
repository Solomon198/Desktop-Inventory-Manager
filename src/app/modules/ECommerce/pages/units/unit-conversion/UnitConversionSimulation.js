import React from "react";
import { Modal } from "react-bootstrap";

class UnitConversionSimulation extends React.Component {
  state = {
    selectedProduct: null, // holds the selected product
    convertFrom: 0, // holds the id of unit to convert from
    convertTo: 0, // holds the id of the unit to convert to
    showConvertFromQty: null, // if convertFrom have a bulk size toggle this to true
    showConvertToQty: null, // if convertTo have a bulk size toggle this to true
    convertFromQty: 0, // if we show showConvertFromQty input then this quantity will be set
    convertToQty: 0, // if we show showConvertToQty input then this quantity will be set

    //mock database of Products and units mapping
    dataBase: {
      products: [
        { id: 1, name: "Klin" },
        { id: 2, name: "Sugar" },
        { id: 5, name: "Maggi" }
      ],

      units: [
        { id: 1, prodId: 1, name: "Pieces", bulkSize: 200, stock: 200 },
        { id: 2, prodId: 1, name: "Carton", bulkSize: null, stock: 200 },
        { id: 3, prodId: 2, name: "Sack", bulkSize: null, stock: 300 },
        { id: 4, prodId: 2, name: "packet", bulkSize: 300, stock: 400 },
        { id: 5, prodId: 5, name: "Sack", bulkSize: null, stock: 500 },
        { id: 6, prodId: 5, name: "Packet", bulkSize: 200, stock: 200 }
      ]
    }
  };

  convert() {
    //STEP-BY-STEP EXPLANATION
    /*
      The conversion module only takes into consideration conversions between two quantity say x and y were x can be the most superset of y or y can be the most superset of x
      1) We get the unit we want to convertFrom and the unit we want to convertTo
      2) Since convertFrom is arbitrary and can represent any unit with either bulksize or not we check if unit in converFrom have a bulk size
            // ASSUMPTIONS
            subject to number two the following assumptions holds
            2.i) if convertFrom have a bulk size it means we want to convert from small quantity to large quantity vice versa
            2.ii if convert to have a bulksize we will display convertToQtyInput field i.e to say the bigger quantity without bulksize have the Qty field

    */

    // get unit to convertFrom
    const convertFrom = this.state.dataBase.units.find(
      (unit, index) => unit.id === parseInt(this.state.convertFrom)
    );
    // get unit to convertTo
    const convertTo = this.state.dataBase.units.find(
      (unit, index) => unit.id === parseInt(this.state.convertTo)
    );

    //check if convertFrom have a bulk size
    if (convertFrom.bulkSize) {
      // =>>>> if true

      //ALGO
      /**
       *  if convertFrom have a bulkSize then that means we will get value of convertToQty
       *  here is the math
       *  let convertFromBulkSize = 200;
       *  let convertToQty = 3;
       *  let totalDeductionsToMakeToConvertFromStockWillBe = convertFromBulkSize * convertToQty;
       *  then total amount to add to convertTo unit will be...
       *  convertToUnit += convertToQty
       *
       *  This explains the steps we have below
       *
       */

      // Total deductions to make from convertFromUnit if it is on stock
      const totalDeducations =
        parseInt(convertFrom.bulkSize) * this.state.convertToQty;

      // using map function to return the update database
      const newUnits = this.state.dataBase.units.map(unit => {
        // check if unit id is equal to convertFromId so that we can get the unit we want to deduct from
        if (unit.id === convertFrom.id) {
          // =>>>>>>>>>>>>>> if true

          // we check if this guy is in stock
          if (convertFrom.stock >= totalDeducations) {
            //=>>>>>>>>>>>>>>>. if true
            unit.stock -= totalDeducations; // we make our deductions
            return unit; // we return the current element in the unit collection to map and continue iteration
          }

          alert("You dont have sufficient stock"); // whenever the condition at the top doesnt hold it means for the specified unit we are out of stock !!!!
          return unit; // return unit still without any modification
        }

        if (unit.id === convertTo.id) {
          // remember this condition will not run simultaneously because while the upper one checks for matches for convertFrom this one checks for matches of id of convertTo which implies the event of equality cannot be true for them all at a spot, this is ok because they are two different things, we are only making emphasis because of the return which will alter the other behaviour if they are checking the same condition
          unit.stock += this.state.convertToQty; // add convertToQty to the larger unit
          return unit; // return the unit;
        }

        return unit; // if nothing happens we still want to return the unit
      });

      const database = this.state.dataBase; // get the database from state
      database.units = newUnits; // update the state with the new array
      this.setState({
        // update state and resset values to get ready to accept input
        database,
        convertFrom: 0,
        convertTo: 0,
        showConvertFromQty: null,
        showConvertToQty: null
      });
    } else {
      // Conversely

      //This condition holds if the unit we wish to convertFrom does not have bulk size, again this means or implies that we are converting from big unit to small unit so convertFrom will have a convertFromQty Input field
      const totalAdditions =
        parseInt(convertTo.bulkSize) * this.state.convertFromQty;

      // updating database using map
      const newUnits = this.state.dataBase.units.map(unit => {
        // we check to get unit to convertTo which is the unit with the bulkSize now
        if (unit.id === convertTo.id) {
          // if true
          if (convertFrom.stock >= this.state.convertFromQty) {
            // check if convertFrom have enough resources to complete the conversion
            unit.stock += totalAdditions; // add to the convertTo which is the smaller guy the totalAddition
            return unit; // return the unit
          }

          alert("You dont have sufficient stock");
          return unit;
        }

        if (unit.id === convertFrom.id) {
          // get unit to covertFrom which is the larger without bulksize
          unit.stock -= this.state.convertFromQty; // Subtract it qty from it
          return unit; // return unit
        }

        return unit;
      });

      const database = this.state.dataBase; // getDb DB
      database.units = newUnits; // update DB
      this.setState({
        // UPDate State
        database,
        convertFrom: 0,
        convertTo: 0,
        showConvertFromQty: null,
        showConvertToQty: null
      });
    }
  }

  validateConvertFrom(unitId) {
    if (unitId == 0) return;
    const unitIdInt = parseInt(unitId);
    const unit = this.state.dataBase.units.find(
      (unit, index) => unit.id === unitIdInt
    );
    if (!this.state.convertTo) {
      this.setState({
        convertFrom: unitId,
        showConvertFromQty: unit.bulkSize ? false : true
      });
    } else {
      const convertTo = this.state.dataBase.units.find(
        (unit, index) => unit.id === parseInt(this.state.convertTo)
      );
      if (convertTo?.bulkSize && unit.bulkSize) {
        return;
      }
      if (!convertTo.bulkSize && !unit.bulkSize) {
        return;
      }

      if (!convertTo.bulkSize && unit.bulkSize) {
        this.setState({ convertFrom: unitId, showConvertToQty: true });
      }

      if (convertTo.bulkSize && !unit.bulkSize) {
        this.setState({ convertFrom: unitId, showConvertFromQty: true });
      }
    }
  }

  validateConvertTo(unitId) {
    if (unitId == 0) return;
    const unitIdInt = parseInt(unitId);
    const unit = this.state.dataBase.units.find(
      (unit, index) => unit.id === unitIdInt
    );

    const convertFrom = this.state.dataBase.units.find(
      (unit, index) => unit.id === parseInt(this.state.convertFrom)
    );

    if (convertFrom.bulkSize && unit.bulkSize) {
      return;
    }
    if (!convertFrom.bulkSize && !unit.bulkSize) {
      return;
    }

    if (!convertFrom.bulkSize && unit.bulkSize) {
      return this.setState({ convertTo: unitId, showConvertFromQty: true });
    }

    if (convertFrom.bulkSize && !unit.bulkSize) {
      return this.setState({ convertTo: unitId, showConvertToQty: true });
    }
  }

  render() {
    return (
      <Modal size="md" show={this.props.show} onHide={this.props.onHide}>
        <div className="UnitConversionSimulation" style={{ marginTop: 20 }}>
          {/* Select product first before seeing option for convertion */}
          <div style={{ display: "flex" }}>
            <div style={{ flexGrow: 1 }}>
              <div>
                <p>Select product</p>
                <select
                  value={this.state.selectedProduct}
                  style={{ width: 300, height: 30 }}
                  onChange={e =>
                    this.setState({ selectedProduct: e.target.value })
                  }
                >
                  <option value="">Select Product</option>
                  {this.state.dataBase.products.map(product => (
                    <option value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>

              {this.state.selectedProduct && (
                <React.Fragment>
                  <div>
                    <p>Conver from </p>
                    <select
                      value={this.state.convertFrom}
                      onChange={e => this.validateConvertFrom(e.target.value)}
                      style={{ width: 300, height: 30 }}
                    >
                      <option value={0}>Select Item</option>
                      {this.state.dataBase.units.map(
                        unit =>
                          unit.prodId ===
                            parseInt(this.state.selectedProduct) && (
                            <option value={unit.id}>{unit.name}</option>
                          )
                      )}
                    </select>

                    {this.state.showConvertFromQty && (
                      <div>
                        <input
                          value={this.state.convertFromQty}
                          onChange={e =>
                            this.setState({
                              convertFromQty: parseInt(e.target.value)
                            })
                          }
                          style={{ width: 300, height: 30, marginTop: 10 }}
                          type="number"
                          placeholder="Quantity"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <p>Convert to</p>
                    <select
                      value={this.state.convertTo}
                      onChange={e => this.validateConvertTo(e.target.value)}
                      disabled={this.state.convertFrom ? false : true}
                      style={{ width: 300, height: 30 }}
                    >
                      <option value={0}>Select Item</option>
                      {this.state.dataBase.units.map(
                        unit =>
                          unit.prodId ===
                            parseInt(this.state.selectedProduct) && (
                            <option value={unit.id}>{unit.name}</option>
                          )
                      )}
                    </select>
                    {this.state.showConvertToQty && (
                      <div>
                        <input
                          value={this.state.convertToQty}
                          onChange={e =>
                            this.setState({
                              convertToQty: parseInt(e.target.value)
                            })
                          }
                          style={{ width: 300, height: 30, marginTop: 10 }}
                          type="number"
                          placeholder="Quantity"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => this.convert()}
                    style={{ width: 300, height: 40, marginTop: 20 }}
                  >
                    Convert Unit
                  </button>
                </React.Fragment>
              )}
            </div>
            <div style={{ flexGrow: 1 }}>
              <h1>Stock History</h1>
              <div>
                {this.state.dataBase.products.map(product => (
                  <>
                    <h4>{product.name} Stock</h4>
                    {this.state.dataBase.units.map(
                      unit =>
                        unit.prodId === product.id && (
                          <p>
                            {unit.name} : {unit.stock}
                          </p>
                        )
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default UnitConversionSimulation;
