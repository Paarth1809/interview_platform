import mongoose from "mongoose";
const { Schema } = mongoose;

const ResponseSchema = new Schema({
  transcript: { type: String },
  evaluation: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: () => new Date() }
});

export default mongoose.model("Response", ResponseSchema);
