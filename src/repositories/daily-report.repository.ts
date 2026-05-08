import { DailyReport, DailyReportModel } from '../models';

export async function findReportsByDateRange(query: any) {
  return DailyReportModel.find(query).sort({ date: 1 });
}

export async function createReport(data: DailyReport) {
  return DailyReportModel.create(data);
}

export async function findReportById(id: string) {
  return DailyReportModel.findOne({ _id: id });
}

export async function updateReportById(id: string, data: DailyReport) {
  return DailyReportModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });
}

export async function insertMany(reports: DailyReport[]) {
  return DailyReportModel.insertMany(reports);
}
