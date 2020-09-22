import {
  assertEquals,
} from "https://deno.land/std@0.70.0/testing/asserts.ts";
// import { denock } from "https://deno.land/x/denock@0.2.0/mod.ts";
// Fixed type issue until https://github.com/SachaCR/denock/issues/7 is merged
import { denock } from "https://raw.githubusercontent.com/use-seedling/denock/master/mod.ts";
import toml from "./mod.ts";

const response = {
  success: (data: Record<string, unknown>) => {
    return data;
  },
  skip: (data: Record<string, unknown>) => {
    return data;
  },
  error: (data: Record<string, unknown>) => {
    return data;
  },
  end: (data: Record<string, unknown>) => {
    return data;
  },
  retry: (data: Record<string, unknown>) => {
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

  const output = await toml(request, response);
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

  const output = await toml(request, response);
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

  const output = await toml(request, response);
  const expected = {
    bin: [
      { name: "deno", path: "cli/main.rs" },
      { name: "deno_core", path: "src/foo.rs" },
    ],
    nib: [{ name: "node", path: "not_found" }],
  };

  assertEquals(output, expected);
});
