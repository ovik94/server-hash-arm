export const transformValue = (
  value: string | undefined
): boolean | string | undefined => {
  if (value === 'TRUE') {
    return true;
  }

  if (value === 'FALSE') {
    return false;
  }

  return value || undefined;
};
