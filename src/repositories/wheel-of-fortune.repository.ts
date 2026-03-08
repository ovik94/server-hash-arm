import {
  WheelOfFortuneModel,
  WheelOfFortuneContentModel,
} from '../models/wheel-of-fortune.model';

export async function findAll() {
  return WheelOfFortuneModel.find().populate('content');
}

export async function findByCode(code: string) {
  return WheelOfFortuneModel.findOne({ code }).populate('content');
}

export async function findById(id: string) {
  return WheelOfFortuneModel.findById(id);
}

export async function deleteById(id: string) {
  return WheelOfFortuneModel.deleteOne({ _id: id });
}

export async function deleteContentById(id: string) {
  return WheelOfFortuneContentModel.deleteOne({ _id: id });
}

export async function createFortune(code: string, description: string) {
  const doc = new WheelOfFortuneModel({ code, description });
  doc.content = [];
  return doc;
}

export async function saveFortune(doc: any) {
  return doc.save();
}

export async function createContentItem(data: any) {
  const doc = new WheelOfFortuneContentModel(data);
  await doc.save();
  return doc;
}
