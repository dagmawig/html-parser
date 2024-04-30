import mongoose from "mongoose";

const Schema = mongoose.Schema;

// database document structure
const DataSchema = new Schema(
    {
        documentJSON: {
            type: Object, default: {}
        }
    },
    { timestamps: true, _id: true, minimize: false, strict: false }
);

// export the new Schema
export default mongoose.model("Data", DataSchema);