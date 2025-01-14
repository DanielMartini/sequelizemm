#! /usr/bin/env node

import { join } from "path"
import { existsSync } from "fs"
import { pathToFileURL } from "url"
import { makemigration } from "sequelizemm"
import { createRequire } from "module"
import chalk from "chalk"
const parsedArgs = () => {
  // Get the command-line arguments
  const args = process.argv.slice(2)

  // Define default values for arguments
  let filePath = "sequelize.js"
  let exportName = "sequelize"
  let exportMigrationPath = undefined

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-f":
      case "--file":
        filePath = args[i + 1]
        i++
        break
      case "-n":
      case "--name":
        exportName = args[i + 1]
        i++
        break
      case "-p":
      case "--path":
        exportMigrationPath = args[i + 1]
        i++
        break
      default:
        console.log(`Usage: ${chalk.bold("sequelizemm [options]")}
  Options:
    -f, --file    Path to a file that exports the Sequelize instance (default: sequelize.js)
    -n, --name    Name of sequelize instance export (default: sequelize)
    -p, --path    Path where migrations files will be exported
    -h, --help    Display this help message`
        )
        process.exit(1)
    }
  }
  return { filePath, exportName }
}

const require = createRequire(import.meta.url)
const cli = async () => {
  try {
    const { filePath, exportName, exportMigrationPath } = parsedArgs()
    const base = await import(pathToFileURL(join(process.cwd(), exportMigrationPath ?? filePath)))
    const dbi = base[exportName]
    if (!dbi || "Sequelize" !== dbi.constructor.name) {
      throw new Error("Sequelize export not found")
    }
    const schemaPath = join(process.cwd(), exportMigrationPath ?? "migrations" + "/schema.json")
    if (existsSync(schemaPath)) {
      const oldSchema = require(schemaPath)
      await makemigration(dbi, oldSchema)
    } else {
      await makemigration(dbi)
    }
    console.log(chalk.green(chalk.bold("Migration created successfully")))
    console.log(
      `If you have any issues or feedback, please feel free to visit the repository and create an issue: ${chalk.greenBright(
        "https://github.com/hasinoorit/sequelizemm"
      )}. Your input is greatly appreciated!`
    )
  } catch (error) {
    console.log(chalk.bgWhiteBright(chalk.red(error.message)))
  }
}

cli()
