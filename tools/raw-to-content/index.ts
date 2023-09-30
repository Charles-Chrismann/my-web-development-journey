import * as fs from "fs";

const dir = fs.readdirSync("../../raw", { withFileTypes: true });

console.log(dir.map((d) => d.isDirectory() ? d.name : null).filter((d) => d));