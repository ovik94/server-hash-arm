import * as wheelOfFortuneRepository from "../repositories/wheel-of-fortune.repository";

const transformWheelOfFortune = (data: any) => ({
  id: data._id,
  code: data.code,
  content: data.content.map((contentItem: any) => ({
    id: contentItem._id,
    color: contentItem.color,
    title: contentItem.title,
  })),
  description: data.description,
});

export async function getWheelOfFortuneList() {
  const list = await wheelOfFortuneRepository.findAll();
  return list.map((item: any) => transformWheelOfFortune(item));
}

export async function getWheelOfFortuneData(code: string) {
  const doc = await wheelOfFortuneRepository.findByCode(code);
  return transformWheelOfFortune(doc);
}

export async function addWheelOfFortune(payload: {
  code: string;
  description: string;
  content: any[];
}) {
  const { code, description, content } = payload;

  const fortune = await wheelOfFortuneRepository.createFortune(
    code,
    description
  );

  for (const contentItem of content) {
    const newContentItem = await wheelOfFortuneRepository.createContentItem(
      contentItem
    );
    fortune.content.push(newContentItem);
  }

  await wheelOfFortuneRepository.saveFortune(fortune);

  const list = await wheelOfFortuneRepository.findAll();
  return list.map((item: any) => transformWheelOfFortune(item));
}

export async function editWheelOfFortune(payload: {
  id: string;
  code: string;
  description: string;
  content: any[];
}) {
  const fortune = await wheelOfFortuneRepository.findById(payload.id);
  if (!fortune) {
    throw new Error('Wheel of fortune not found');
  }

  for (const fortuneContentItem of fortune.content) {
    await wheelOfFortuneRepository.deleteContentById(fortuneContentItem._id);
  }

  fortune.code = payload.code;
  fortune.description = payload.description;
  fortune.content = [];

  for (const contentItem of payload.content) {
    const newContentItem = await wheelOfFortuneRepository.createContentItem(
      contentItem
    );
    fortune.content.push(newContentItem);
  }

  await wheelOfFortuneRepository.saveFortune(fortune);

  const list = await wheelOfFortuneRepository.findAll();
  return list.map((item: any) => transformWheelOfFortune(item));
}

export async function deleteWheelOfFortune(id: string) {
  const fortune = await wheelOfFortuneRepository.findById(id);

  if (fortune) {
    for (const fortuneContentItem of fortune.content) {
      await wheelOfFortuneRepository.deleteContentById(fortuneContentItem._id);
    }
  }

  await wheelOfFortuneRepository.deleteById(id);

  const list = await wheelOfFortuneRepository.findAll();
  return list.map((item: any) => transformWheelOfFortune(item));
}

