import { rmSync } from "node:fs";
// A clean output prevents removed albums/pages surviving the next deployment.
rmSync(new URL("../dist/", import.meta.url), { recursive: true, force: true });
