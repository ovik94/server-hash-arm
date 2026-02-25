import { iikoCloudApi } from "../lib";
import { format } from "date-fns";

export async function getReserveList(date?: string) {
  return iikoCloudApi.getReserveListIds(date || '');
}

export async function getCurrentPrepays() {
  const currentFormattedDate = `${format(new Date(), "yyyy-MM-dd")} 00:00:00.123`;
  const reserveIds =
    (await iikoCloudApi.getReserveListIds(currentFormattedDate)) || [];
  return iikoCloudApi.getCurrentPrepays(reserveIds);
}

export async function getMenuList() {
  return iikoCloudApi.getMenuList();
}

export async function getMenu(id: string) {
  const menu = await iikoCloudApi.getMenuById(id);

  return menu.itemCategories.map((itemCategory: any) => ({
    id: itemCategory.id,
    name: itemCategory.name,
    items: itemCategory.items.map((menuItem: any) => {
      const itemSize = menuItem.itemSizes.find((item: any) => item.isDefault);

      return {
        name: menuItem.name,
        description: menuItem.description,
        size: {
          weight: itemSize?.portionWeightGrams,
          sizeName: itemSize?.sizeName || "гр.",
        },
        price: itemSize?.prices[0]?.price,
        image: itemSize?.buttonImageUrl,
      };
    }),
  }));
}

