// lib/getNextSequence.js
import Counter from "@/lib/models/Counter.js";

export async function getNextSequence(modelName) {
  const counter = await Counter.findOneAndUpdate(
    { model: modelName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // create if not exists
  );
  return counter.seq;
}
