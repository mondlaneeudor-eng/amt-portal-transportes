const path = require("path");
const { spawn } = require("child_process");

const projectRoot = path.join(__dirname, "..");
const viteBin = path.join(
  projectRoot,
  "node_modules",
  "vite",
  "dist",
  "node",
  "cli.js"
);

const child = spawn(
  process.execPath,
  [viteBin, "--port", "3014", "--strictPort"],
  { cwd: projectRoot, stdio: "inherit" }
);

child.on("exit", (code) => process.exit(code ?? 0));
