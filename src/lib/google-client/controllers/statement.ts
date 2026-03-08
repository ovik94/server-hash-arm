import { GoogleApi } from '../google-api';
import { financialOperationsGApiController } from './financial-operations';
import { CounterpartyDocument } from '../../../models';

export class StatementGApiController extends GoogleApi {
  addStatementOperation = async (operationInfo: {
    operation: {
      date: string;
      incoming?: number;
      expense?: number;
      name?: string;
    };
    cashFlowStatement: string;
    paymentOperation: string;
    counterparty?: CounterpartyDocument;
    comment?: string;
  }): Promise<void> => {
    const {
      operation,
      cashFlowStatement,
      paymentOperation,
      counterparty,
      comment,
    } = operationInfo;

    await financialOperationsGApiController.addFinancialOperation([
      '',
      operation.date,
      cashFlowStatement,
      paymentOperation,
      operation.incoming || operation.expense || '',
      counterparty?.name || '',
      comment || '',
    ]);
  };
}

export const statementGApiController = new StatementGApiController();
