export const stringTransformer = {
  to: (value: string): string => {
    return value && value.toLowerCase();
  },
  from: (value: string): string => {
    return value && value.toLowerCase();
  },
};
