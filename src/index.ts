import type { Sequelize } from "sequelize"
import currentSchema from "./currentSchema.js"
import { compareSchema } from "./compareSchema.js"
import type { Schema } from "./types"
export const makemigration = async (
  db: Sequelize,
  oldSchema?: Schema,
  options?: Map<string, string>
): Promise<void> => {
  const current = currentSchema(db)
  // const old: any = await fs.readFile("1669223879936-init.json", { encoding: "utf-8" })
  if (oldSchema) {
    await compareSchema(current, oldSchema, options)
  } else {
    await compareSchema(current, undefined, options)
  }
}
