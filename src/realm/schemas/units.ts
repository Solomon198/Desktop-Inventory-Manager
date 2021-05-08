import { UnitTypes } from "../../types/unit";

const UnitSchema: UnitTypes = {
  name: "units",

  primaryKey: "_id",

  properties: {
    _id: "objectId",

    product_id: "objectId",

    name: "string?",

    price: "float?"
  }
};

export default UnitSchema;
