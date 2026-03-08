import { banquetGApiController, iikoWebApi } from '../lib';

export async function getWebMenu() {
  const menu = await iikoWebApi.getMenu();
  const options = await banquetGApiController.getBanquetOptions();

  const transformedMenu: any[] = [];

  for (const group of menu) {
    transformedMenu.push({
      id: group.id,
      name: group.name,
      items: group.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.itemSizes[0].price,
      })),
    });
  }

  return { options, menu: transformedMenu };
}

export async function getMenuItem(id: string) {
  const menuItem = await iikoWebApi.getMenuItem(id);

  return {
    name: menuItem.name,
    description: menuItem.description,
    price: menuItem.itemSizes[0].price,
    portionWeightGrams: menuItem.itemSizes[0].portionWeightGrams,
  };
}
