import fs from "fs";
import http from "https";

export default async function downloadFileFromUrl(
  url: string,
  path: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path);
    http.get(url, (response) => {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        resolve(true);
      });

      file.on("error", (error) => {
        fs.unlink(path, () => {});
        reject(error);
      });
    });
  });
}
