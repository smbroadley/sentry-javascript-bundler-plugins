import childProcess from "child_process";
import path from "path";
import { testIfNodeMajorVersionIsLessThan18 } from "../../utils/testIf";

/**
 * Runs a node file in a seprate process.
 *
 * @param bundlePath Path of node file to run
 * @returns Stdout of the process
 */
function checkBundle(bundlePath: string): void {
  const processOutput = childProcess.execSync(`node ${bundlePath}`, { encoding: "utf-8" });

  const expectedNodeVersion = parseInt(process.versions.node);

  expect(JSON.parse(processOutput)).toEqual(
    expect.objectContaining({
      deps: expect.arrayContaining<string>([
        "esbuild",
        "rollup",
        "vite",
        "webpack4",
        "webpack5",
      ]) as string[],
      depsVersions: { rollup: 3, vite: 3 },
      // This will differ based on what env this is run on
      nodeVersion: expectedNodeVersion,
    })
  );
}

test("esbuild bundle", () => {
  expect.assertions(1);
  checkBundle(path.join(__dirname, "out", "esbuild", "index.js"));
});

test("rollup bundle", () => {
  expect.assertions(1);
  checkBundle(path.join(__dirname, "out", "rollup", "index.js"));
});

test("vite bundle", () => {
  expect.assertions(1);
  checkBundle(path.join(__dirname, "out", "vite", "index.js"));
});

testIfNodeMajorVersionIsLessThan18("webpack 4 bundle", () => {
  expect.assertions(1);
  checkBundle(path.join(__dirname, "out", "webpack4", "index.js"));
});

test("webpack 5 bundle", () => {
  expect.assertions(1);
  checkBundle(path.join(__dirname, "out", "webpack5", "index.js"));
});
