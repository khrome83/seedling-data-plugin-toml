# seedling-data-plugin-toml

A data plugin to read and parse TOML data.

## Usage

1. Create a new file in `/data` with the name `toml.ts`.

```ts
import toml from "https://raw.githubusercontent.com/use-seedling/seedling-data-plugin-toml/master/mod.ts";
export default toml;
```

2. Use with seedling data directive. There are three ways to use the directive.

### As raw inline TOML

```html
  <:data use="toml">
    [[foo]]
    hello = "world"
  </:data>
```

### From a local file

```html
<:data use="toml" file="path/to/json/file.toml" />
```

> **Note** - This plugin requires the `--allow-read` command line parameter for Deno when using file attribute.

### From a remote url

```html
<:data use="toml" url="https://example.com/path/to/file.toml" />
```

> **Note** - This plugin requires the `--allow-net` command line parameter for Deno when using url attribute.
