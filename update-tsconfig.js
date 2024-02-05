const fs = require("fs")
const path = require("path")

const tsconfigPath = path.join(__dirname, "tsconfig.json")
const tsconfig = require(tsconfigPath)

tsconfig.compilerOptions = tsconfig.compilerOptions || {}
tsconfig.compilerOptions.paths = { "@/*": ["./src/*"] }

fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2))
