import RealmApp from '../dbConfig/config';
import * as mongoose from 'mongoose';
import Schemas from '../schemas/index'
import {CustomerProperties} from '../../types/customer';

const app = RealmApp();
export function CreateCustomer(customer:CustomerProperties){
    customer._id = mongoose.Types.ObjectId();
    app.write(()=>{
        app.create(Schemas.CustomerSchema.name,customer)
    })
}