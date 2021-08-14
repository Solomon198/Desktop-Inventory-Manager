import { UnitTypes } from "../../types/unit";

const UnitSchema: UnitTypes = {
  name: "units",

  primaryKey: "_id",

  properties: {
    _id: "objectId",

    product_id: "objectId",

    name: "string?",

    bulk_size: "int?",

    price: "float?"
  }
};

export default UnitSchema;
