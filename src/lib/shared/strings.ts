export const stripLeadingSlash = (str: string) => {
  return str.startsWith("/") ? str.slice(1) : str;
};

export const truncateAddress = (address: string, chars = 4) => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
