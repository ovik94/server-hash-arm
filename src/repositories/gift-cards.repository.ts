import { GiftCardsModel } from '../models/gift-cards.model';

export async function findByNominal(nominal?: string) {
  if (!nominal) {
    return GiftCardsModel.find({});
  }
  return GiftCardsModel.find({ value: nominal });
}

export async function insertMany(values: any[]) {
  return GiftCardsModel.insertMany(values);
}

export async function updateStatusToActivated(
  number: number | string,
  date: string
) {
  return GiftCardsModel.updateOne(
    { number },
    { status: 'ACTIVATED', activationDate: date }
  );
}

export async function findByNumber(number: number | string) {
  return GiftCardsModel.findOne({ number });
}
