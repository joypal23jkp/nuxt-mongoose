import type { ConnectOptions, Model, SchemaDefinition, SchemaOptions } from 'mongoose'
import mongoose from 'mongoose'
import { logger } from '@nuxt/kit'

import { useRuntimeConfig } from '#imports'

export async function defineMongooseConnection({ uri, options }: { uri?: string; options?: ConnectOptions } = {}): Promise<void> {
  const config = useRuntimeConfig().mongoose
  const mongooseUri = uri || config.uri
  const mongooseOptions = options || config.options

  try {
    await mongoose.connect(mongooseUri, { ...mongooseOptions })
    logger.info('Connected to mongoose database')
  }
  catch (err) {
    logger.error('Error connecting to database', err)
  }
}

export function defineMongooseModel(nameOrOptions: string | { name: string; schema: SchemaDefinition; options?: SchemaOptions }, schema?: SchemaDefinition, options?: SchemaOptions): Model<any> {
  let name: string
  if (typeof nameOrOptions === 'string') {
    name = nameOrOptions
  }
  else {
    name = nameOrOptions.name
    schema = nameOrOptions.schema
    options = nameOrOptions.options
  }

  const newSchema = new mongoose.Schema({
    ...schema,
  }, { ...options })
  return mongoose.model(name, newSchema)
}
