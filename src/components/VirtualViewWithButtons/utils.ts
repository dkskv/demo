export function findInitialIndex(items: { key: string }[], initialKey: string) {
    const index = items.findIndex(({ key }) => initialKey === key);
  
    if (~index) {
      return index;
    }
  
    throw new Error("Invalid initial key");
  }