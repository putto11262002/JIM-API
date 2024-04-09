import * as cheerio from "cheerio";
import _ from "lodash";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import https from "node:https";
import path from "node:path";

const keyMap: Record<string, string> = {
  HEIGHT: "height",
  BUST: "bust",
  WEIGHT: "weight",
  WAIST: "waist",
  SHOES: "shoeSize",
  EYES: "eyeColor",
  HAIR: "hairColor",
};

async function fetchHTML(url: string): Promise<string | Error> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status code: ${res.statusCode}`));
      }

      if (!res.headers["content-type"]?.includes("text/html")) {
        reject(new Error(`Content type: ${res.headers["content-type"]}`));
      }

      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(data);
      });
      res.on("error", (err) => {
        reject(err);
      });
    });
  });
}

export type ModelImage = {
  name: string;
  images: string[];
};

async function scrapeModelImages(html: string): Promise<ModelImage[]> {
  const $ = cheerio.load(html);

  const modelsLinks = $("div[role=listitem]")
    .map((i, el) => {
      const profileLink = $(el).find("a").first().attr("href");

      return profileLink;
    })
    .toArray()
    .filter((link) => link !== undefined);

  const modelImages: ModelImage[] = [];

  for (const link of modelsLinks) {
    console.log("Visitting:", link);
    const returned = await fetchHTML(link);
    if (returned instanceof Error) {
      console.error(returned);
      continue;
    }
    const $ = cheerio.load(returned);

    const name = $("main h5").first().text();

    const images = $("main img")
      .map((i, el) => $(el).attr("src"))
      .toArray()
      .filter((src) => src !== undefined);

    modelImages.push({ name, images });
  }

  return modelImages;
}

async function downloadImages(images: ModelImage[], outDir: string) {
  const newModelImage: ModelImage[] = [];
  for (const image of images) {
    const imagePaths = [];
    for (const img of image.images) {
      try {
        const { output } = await new Promise<{ output: string }>(
          (resolve, reject) => {
            fs.mkdir(
              path.join(outDir, image.name),
              { recursive: true },
              (err) => {
                if (err) {
                  reject(err);
                }

                https.get(img, (res) => {
                  if (res.statusCode !== 200) {
                    reject(new Error("Failed to download image"));
                  }

                  if (!res.headers["content-type"]?.includes("image")) {
                    reject(new Error("Content type is not an image"));
                  }

                  const uuid = randomUUID();
                  const extension = img.split(".").pop();
                  const nane = `${uuid}.${extension}`;
                  const output = path.join(outDir, image.name, nane);
                  const wriableStream = fs.createWriteStream(output, {
                    flags: "w",
                    mode: 0o644,
                  });

                  res.pipe(wriableStream);

                  wriableStream.on("finish", () => {
                    resolve({ output });
                  });
                });
              }
            );
          }
        );

        imagePaths.push(output);
      } catch (err) {
        console.error(err);
      }
    }

    newModelImage.push({ name: image.name, images: imagePaths });
  }

  return newModelImage;
}

async function main() {
  const returned = await fetchHTML("https://www.jimmodel.com/male");
  if (returned instanceof Error) {
    console.error(returned);
    return;
  }

  const modelImages = await scrapeModelImages(returned);

  const newModelImages = await downloadImages(modelImages, "./data/men/images");

  fs.writeFile(
    "./data/men/meta.json",
    JSON.stringify(newModelImages),
    { encoding: "utf-8", mode: 0o644, flag: "w" },
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}

main();
