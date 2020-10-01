import toHex from 'colornames'
export function colorNumber (colorName: string) {
  const colorHex: string | undefined = toHex(colorName);

  if (!colorHex) {
    console.log('An invalid color name was supplied. Defaulting to black.')
    return 0x000000;
  }

  return parseInt(colorHex.slice(1), 16);
};
