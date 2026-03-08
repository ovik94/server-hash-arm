import * as counterpartiesRepository from '../repositories/counterparties.repository';

const transform = (data: any[]) =>
  data.map((field) => ({
    name: field.name,
    type: field.type,
    companyName: field.companyName,
    phone: field.phone,
    description: field.description,
    id: field._id,
  }));

export async function getCounterparties(type?: string) {
  const docs = await counterpartiesRepository.findByType(type);
  return transform(docs);
}

export async function addCounterparty(payload: any) {
  await counterpartiesRepository.create(payload);
  const docs = await counterpartiesRepository.findByType(undefined);
  return transform(docs);
}

export async function editCounterparty(payload: any) {
  const doc = await counterpartiesRepository.findById(payload.id);
  if (!doc) {
    throw new Error('Counterparty not found');
  }

  doc.name = payload.name;
  doc.type = payload.type;
  doc.companyName = payload.companyName;
  doc.phone = payload.phone;
  doc.description = payload.description;

  await counterpartiesRepository.save(doc);

  const docs = await counterpartiesRepository.findByType(undefined);
  return transform(docs);
}

export async function deleteCounterparty(id: string) {
  await counterpartiesRepository.deleteById(id);
  const docs = await counterpartiesRepository.findByType(undefined);
  return transform(docs);
}
