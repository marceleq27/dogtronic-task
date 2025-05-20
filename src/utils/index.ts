interface ParsedAddress {
  street: string;
  city: string;
}

export const parseAddress = (address: string): ParsedAddress => {
  const parts = address.split(",").map((part) => part.trim());
  return {
    street: parts[0] ?? "",
    city: parts[1] ?? "",
  };
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
