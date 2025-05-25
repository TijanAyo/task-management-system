export const AppResponse = (
  message: string,
  data: any | null | undefined = undefined,
  success: boolean = true
) => {
  return {
    data,
    message,
    success,
  };
};
