import * as fs from 'node:fs'
import { TableBuilder } from './tableBuilder'
import { type ComponentValueEntry, Dictionary } from './validator'

export class ComponentValueTableBuilder extends TableBuilder<ComponentValueEntry> {
  build(): Dictionary<ComponentValueEntry> {
    const fileLoc: string | undefined = this.getDefinitionFileLoc('components')
    let dict: Dictionary<ComponentValueEntry>

    if (fileLoc) {
      const sData: string = fs.readFileSync(fileLoc, {
        encoding: 'utf-8',
      })
      const data: { [key: string]: ComponentValueEntry } = JSON.parse(
        sData,
      ) as {
        [key: string]: ComponentValueEntry
      }

      dict = new Dictionary<ComponentValueEntry>(data)
    } else {
      dict = new Dictionary<ComponentValueEntry>()
    }

    return dict
  }
}
