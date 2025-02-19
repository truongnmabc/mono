export const convertToJSONObject = (model: unknown) => {
  return JSON.parse(JSON.stringify(model));
};

export const parseJSONdata = <T>(jsonString: unknown): T | null => {
  return typeof jsonString === 'string' ? (JSON.parse(jsonString) as T) : null;
};
