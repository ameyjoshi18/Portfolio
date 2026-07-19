import { resolveMotionPolicy } from "@/lib/motion/policy";

const capable = {
  reducedMotion: false,
  saveData: false,
  viewportWidth: 1440,
  webgl: true,
  hardwareConcurrency: 8,
  deviceMemory: 8,
};

it.each([
  [
    { ...capable, reducedMotion: true },
    { dom: "resolved", cutover: "static" },
  ],
  [{ ...capable, saveData: true }, { dom: "resolved", cutover: "static" }],
  [{ ...capable, viewportWidth: 767 }, { dom: "full", cutover: "static" }],
  [{ ...capable, webgl: false }, { dom: "full", cutover: "static" }],
  [
    { ...capable, hardwareConcurrency: 2 },
    { dom: "full", cutover: "static" },
  ],
  [capable, { dom: "full", cutover: "webgl" }],
] as const)("resolves capability policy", (input, expected) => {
  expect(resolveMotionPolicy(input)).toEqual(expected);
});
