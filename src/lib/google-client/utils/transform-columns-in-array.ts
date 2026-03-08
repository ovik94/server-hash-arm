export const transformColumnsInArray = (
  data: string[][]
): { title: string; items: string[] }[] => {
  const heads = data[0];
  const rows = data.slice(1);
  const result: { title: string; items: string[] }[] = [];

  heads.forEach((item) => result.push({ title: item, items: [] }));

  rows.forEach((row) => {
    row.forEach((value, index) => {
      result[index].items.push(value);
    });
  });

  return result;
};
