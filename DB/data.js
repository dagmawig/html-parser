import mongoose from "mongoose";

const Schema = mongoose.Schema;

const DataSchema = new Schema(
    {
        documentJSON: {
            type: Object, default: {}
        }
    },
    {timestamps: true, _id: true, minimize: false, strict: false}
);

export default mongoose.model("Data", DataSchema);