import { transformValue } from './transform-value';

export const transformRowsInArray = (
  data: string[][]
): Record<string, boolean | string | undefined>[] => {
  const items: Record<string, boolean | string | undefined>[] = [];
  const heads = data[0];
  const rows = data.slice(1);

  rows.forEach((row) => {
    const item: Record<string, boolean | string | undefined> = {};
    row.forEach((value, index) => {
      const key = heads[index];
      item[key] = transformValue(value);
    });

    items.push(item);
  });

  return items;
};
