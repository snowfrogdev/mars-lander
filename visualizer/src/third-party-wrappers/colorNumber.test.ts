import { colorNumber } from "./colorNumber";

test.each([
  ['crimson', 0xdc143c],
  ['PiNk', 0xffc0cb],
  ['BLUE', 0x0000ff],
  ['brown', 0xa52a2a],
  ['wHiTe', 0xffffff],
  ['black', 0x000000],
])('colorHex(%s) converts color to hex number %i', (name, hex) => {
  expect(colorNumber(name)).toBe(hex);
})