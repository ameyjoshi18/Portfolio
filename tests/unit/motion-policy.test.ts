import { resolveMotionPolicy } from "@/lib/motion/policy";

const capable = {
  reducedMotion: false,
  saveData: false,
  viewportWidth: 1440,
  hardwareConcurrency: 8,
  deviceMemory: 8,
};

it.each([
  [
    { ...capable, reducedMotion: true },
    { dom: "resolved", cutover: "static" },
  ],
  [{ ...capable, saveData: true }, { dom: "resolved", cutover: "static" }],
  [{ ...capable, viewportWidth: 767 }, { dom: "resolved", cutover: "animated" }],
  [{ ...capable, viewportWidth: 1023 }, { dom: "resolved", cutover: "animated" }],
  [
    { ...capable, hardwareConcurrency: 1 },
    { dom: "full", cutover: "static" },
  ],
  [
    { ...capable, deviceMemory: 1 },
    { dom: "full", cutover: "static" },
  ],
  [
    { ...capable, hardwareConcurrency: 2 },
    { dom: "full", cutover: "animated" },
  ],
  [capable, { dom: "full", cutover: "animated" }],
] as const)("resolves capability policy", (input, expected) => {
  expect(resolveMotionPolicy(input)).toEqual(expected);
});
