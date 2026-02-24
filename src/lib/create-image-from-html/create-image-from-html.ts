import nodeHtmlToImage from "node-html-to-image";
import { reportTemplate } from "./report-template";
import { feedbackTemplate } from "./feedback-template";
import { banquetTemplate } from "./banquet-template";
import { reportFtTemplate } from "./report-ft-template";
import { giftCardsTemplate } from "./gift-cards-template";

export enum TemplateTypes {
  REPORT = "REPORT",
  FEEDBACK = "FEEDBACK",
  BANQUET = "BANQUET",
  REPORT_FT = "REPORT_FT",
  GIFT_CARDS = "GIFT_CARDS",
}

const Templates: Record<TemplateTypes, string> = {
  [TemplateTypes.REPORT]: reportTemplate,
  [TemplateTypes.FEEDBACK]: feedbackTemplate,
  [TemplateTypes.BANQUET]: banquetTemplate,
  [TemplateTypes.REPORT_FT]: reportFtTemplate,
  [TemplateTypes.GIFT_CARDS]: giftCardsTemplate,
};

interface CreateImageOptions {
  puppeteerArgs?: {
    args?: string[];
    executablePath?: string;
  };
  type?: "jpeg" | "png";
  quality?: number;
  selector?: string;
}

export const createImageFromHtml = async (
  content: unknown,
  type: TemplateTypes = TemplateTypes.REPORT,
  options?: CreateImageOptions
) => {
  const puppeteerArgs = {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: "/usr/bin/chromium-browser",
  };

  return await nodeHtmlToImage({
    html: Templates[type],
    puppeteerArgs,
    content: content as Parameters<typeof nodeHtmlToImage>[0]["content"],
    type: "jpeg",
    quality: 100,
    ...options,
  });
};
