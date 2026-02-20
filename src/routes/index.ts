import { Router } from "express";
import userRoutes from "./user.routes";
import appDailyReportRoutes from "./app/daily-report.routes";
import counterpartiesRoutes from "./counterparties.routes";
import lunchRoutes from "./lunch.routes";
import wheelOfFortuneRoutes from "./wheel-of-fortune.routes";
import feedbackRoutes from "./feedback.routes";
import statementRoutes from "./statement.routes";
import metricsRoutes from "./metrics.routes";
import giftCardsRoutes from "./gift-cards.routes";
import cashFlowStatementRoutes from "./cash-flow-statement.routes";
import iikoRoutes from "./iiko/iiko.routes";
import iikoCloudRoutes from "./iiko/iiko-cloud.routes";
import iikoServerRoutes from "./iiko/iiko-server.routes";
import appExpenseRoutes from "./app/expense.routes";
import appExpenseV2Routes from "./app/expense-v2.routes";

const router = Router();

router.use("/api/user", userRoutes);
router.use("/api/v2/counterparties", counterpartiesRoutes);
router.use("/api/lunch", lunchRoutes);
router.use("/api/wheel-of-fortune", wheelOfFortuneRoutes);
router.use("/api/feedback", feedbackRoutes);
router.use("/api/statement", statementRoutes);
router.use("/api/metrics", metricsRoutes);
router.use("/api/gift-cards", giftCardsRoutes);
router.use("/api/cash-flow-statement", cashFlowStatementRoutes);

// iiko
router.use("/api/iiko", iikoRoutes);
router.use("/api/iiko-cloud", iikoCloudRoutes);
router.use("/api/iiko-server", iikoServerRoutes);

// app
router.use("/api/app/dailyReport", appDailyReportRoutes);
router.use("/api/app/expenses", appExpenseRoutes);
router.use("/api/v2/app/expenses", appExpenseV2Routes);

export default router;

