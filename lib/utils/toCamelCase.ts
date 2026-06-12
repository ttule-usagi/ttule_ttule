export const toCamel = (str: string): string => {
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
};

export const toCamelKey = <T>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelKey(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [toCamel(key), toCamelKey(value)])) as T;
  }
  return obj;
};
