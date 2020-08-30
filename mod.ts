import {
  Request,
  Response,
} from "https://raw.githubusercontent.com/use-seedling/seedling/master/mod.ts";
import { join } from "https://deno.land/std@0.67.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.67.0/encoding/toml.ts";

interface TOMLFiles {
  file?: string;
  url?: string;
}

export default async (request: Request, response: Response) => {
  const body = request.body?.trim();
  const { file, url } = request.attrs as TOMLFiles;

  if (body !== undefined && body.length > 0) {
    try {
      return response.success(parse(body));
    } catch (e) {
      return response.error(
        "Unable to parse TOML in body of Data Directive",
        e,
      );
    }
  } else if (file !== undefined) {
    const path = join(request.root, file);
    try {
      const file = await Deno.readTextFile(path);
      return response.success(parse(file));
    } catch (e) {
      return response.error(`Unable to open file at '${path}'`, e);
    }
  } else if (url !== undefined) {
    try {
      const result = await fetch(url);

      if (!result.ok) {
        if (result.status >= 500) {
          return response.retry(
            "Unexpected error, backing off and then trying again",
          );
        } else if (result.status >= 400 && result.status < 500) {
          return response.error("Network issue, request failed");
        }
      }

      const output = await result.text();
      return response.success(parse(output));
    } catch (e) {
      console.log(e);
      return response.error("Something went wrong", e);
    }
  } else {
    return response.error(
      "No valid methods provided for TOML in Data Directive",
    );
  }
};
