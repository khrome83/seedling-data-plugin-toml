import {
  assertEquals,
} from "https://deno.land/std@0.64.0/testing/asserts.ts";
import { denock } from "https://deno.land/x/denock@0.2.0/mod.ts";
import json from "./mod.ts";

const response = {
  success: (data: object) => {
    return data;
  },
  skip: (data: object) => {
    return data;
  },
  error: (data: object) => {
    return data;
  },
  end: (data: object) => {
    return data;
  },
  retry: (data: object) => {
    return data;
  },
};

Deno.test("TOML in body of data directive", async () => {
  const request = {
    attrs: {},
    body: `
    [[bin]]
    name = "deno"
    path = "cli/main.rs"
    
    [[bin]]
    name = "deno_core"
    path = "src/foo.rs"
    
    [[nib]]
    name = "node"
    path = "not_found"
    `,
    root: Deno.cwd(),
  };

  const output = await json(request, response);
  const expected = {
    bin: [
      { name: "deno", path: "cli/main.rs" },
      { name: "deno_core", path: "src/foo.rs" },
    ],
    nib: [{ name: "node", path: "not_found" }],
  };

  assertEquals(output, expected);
});

Deno.test("TOML from file attribute of data directive", async () => {
  const request = {
    attrs: {
      file: "test.toml",
    },
    body: "",
    root: Deno.cwd(),
  };

  const output = await json(request, response);
  const expected = {
    bin: [
      { name: "deno", path: "cli/main.rs" },
      { name: "deno_core", path: "src/foo.rs" },
    ],
    nib: [{ name: "node", path: "not_found" }],
  };

  assertEquals(output, expected);
});

Deno.test("TOML from url attribute of data directive", async () => {
  const request = {
    attrs: {
      url: "https://example.com/test.toml",
    },
    body: "",
    root: Deno.cwd(),
  };

  denock({
    method: "GET",
    protocol: "https",
    host: "example.com",
    path: "/test.toml",
    replyStatus: 200,
    responseBody: `
    [[bin]]
    name = "deno"
    path = "cli/main.rs"
    
    [[bin]]
    name = "deno_core"
    path = "src/foo.rs"
    
    [[nib]]
    name = "node"
    path = "not_found"
    `,
  });

  const output = await json(request, response);
  const expected = {
    bin: [
      { name: "deno", path: "cli/main.rs" },
      { name: "deno_core", path: "src/foo.rs" },
    ],
    nib: [{ name: "node", path: "not_found" }],
  };

  assertEquals(output, expected);
});
