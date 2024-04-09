import { parse } from "csv-parse";
import fs from "node:fs";
import {ModelImage} from "./csv-to-json"
import fsPromise from "node:fs/promises"


function readModelProfileDetails() {
  return new Promise<string[][]>((resolve, reject) => {
    const parser = parse({ delimiter: ",", quote: `"`, bom: true });
    const readStream = fs.createReadStream("./data/men/men.csv");
    const records: string[][] = [];

    readStream.pipe(parser);

    parser.on("data", (record) => {
      records.push(record);
    });

    parser.on("end", () => {
      resolve(records);
    });

    parser.on("error", (err) => {
      reject(err);
    });
  });
}

async function main() {
  try {
    const records = await readModelProfileDetails();
    const selectedColumnNames = ["NAME", "WEIGHT", "SHOES", "EYES ", "HAIR", "HEIGHT", "CHEST"]

    const label = ["name", "weight", "shoeSize", "eyeColor", "hairColor", "height", "chest"]

    const selectedColumnIndex = selectedColumnNames.map((name) => records[0].indexOf(name));




   const data = await fsPromise.readFile("./data/men/meta.json", "utf-8")
    const modelImage: ModelImage[] = JSON.parse(data)

    const selectedRecords = records.map((record) => {
      const values =  selectedColumnIndex.map((index) => record[index]);
      const obj: Record<string, any>  = {}
        label.forEach((key, index) => {
            obj[key] = values[index].trim()
        })

        const image = modelImage.find((img) => img.name === obj.name)
        if (image) {
          obj["images"] = image.images
        }

        obj["gender"] = "male"

        return obj

    });

    await fsPromise.writeFile("./data/men/aggregated.json", JSON.stringify(selectedRecords, null, 2), "utf-8");

  } catch (err) {
    console.error(err);
  }
}

main();