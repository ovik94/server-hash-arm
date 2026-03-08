import * as cashFlowStatementRepository from '../repositories/cash-flow-statement.repository';

const transform = (data: any[]) =>
  data.map((field) => ({
    name: field.name,
    type: field.type,
    paymentTypes: field.paymentTypes,
    purposeOfPayment: field.purposeOfPayment,
    id: field._id,
  }));

export async function getCashFlowStatement(type?: string) {
  const docs = await cashFlowStatementRepository.findByType(type);
  return transform(docs);
}

export async function addCashFlowStatement(payload: any) {
  await cashFlowStatementRepository.create(payload);
  const all = await cashFlowStatementRepository.findByType(undefined);
  return transform(all);
}

export async function editCashFlowStatement(payload: any) {
  const doc = await cashFlowStatementRepository.findById(payload.id);
  if (!doc) {
    throw new Error('Cash flow statement not found');
  }

  doc.name = payload.name;
  doc.type = payload.type;
  doc.paymentTypes = payload.paymentTypes;
  doc.purposeOfPayment = payload.purposeOfPayment;

  await cashFlowStatementRepository.save(doc);

  const all = await cashFlowStatementRepository.findByType(undefined);
  return transform(all);
}

export async function deleteCashFlowStatement(id: string) {
  await cashFlowStatementRepository.deleteById(id);
  const all = await cashFlowStatementRepository.findByType(undefined);
  return transform(all);
}
