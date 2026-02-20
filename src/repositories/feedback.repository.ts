import { FeedbackModel } from "../models/feedback.model";

export async function findAll() {
  return FeedbackModel.find();
}

export async function replaceAll(requests: any[]) {
  await FeedbackModel.deleteMany();
  return FeedbackModel.create(requests);
}

