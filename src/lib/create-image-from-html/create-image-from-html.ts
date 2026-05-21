import { reportTemplate } from './report-template';
import { feedbackTemplate } from './feedback-template';
import { giftCardsTemplate } from './gift-cards-template';
import axios from 'axios';
import { config } from '../../config';

export enum TemplateTypes {
  REPORT = 'REPORT',
  FEEDBACK = 'FEEDBACK',
  GIFT_CARDS = 'GIFT_CARDS',
}

const Templates: Record<TemplateTypes, string> = {
  [TemplateTypes.REPORT]: reportTemplate,
  [TemplateTypes.FEEDBACK]: feedbackTemplate,
  [TemplateTypes.GIFT_CARDS]: giftCardsTemplate,
};

interface CreateImageOptions {
  type?: 'jpeg' | 'png';
  quality?: number;
  selector?: string;
}

export const createImageFromHtml = async (
  content: unknown,
  type: TemplateTypes = TemplateTypes.REPORT,
  options?: CreateImageOptions
) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${config.imageRender.host}:${config.imageRender.port}/render`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        html: Templates[type],
        data: content,
        options: {
          quality: options?.quality || 90,
          format: options?.type || 'jpeg',
          selector: options?.selector || '.root',
        },
      },
      responseType: 'arraybuffer',
      timeout: 60000,
    });

    return Buffer.from(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Render service error:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });

      // Пытаемся распарсить ошибку
      let errorMessage = error.message;
      if (error.response?.data) {
        try {
          const errorData = JSON.parse(error.response.data.toString());
          errorMessage = errorData.error || errorData.details || error.message;
        } catch {
          errorMessage = error.response.data.toString();
        }
      }

      throw new Error(`Image generation failed: ${errorMessage}`);
    }
    throw error;
  }
};
