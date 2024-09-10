import { assertEquals } from "@std/assert";
import { demo } from "./main.ts";

Deno.test(async function addTest() {
  const [input, output, input2] = await demo();
  assertEquals(input, input2);
});
