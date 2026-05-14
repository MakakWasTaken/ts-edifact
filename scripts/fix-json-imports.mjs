// SWC strips `with { type: 'json' }` import attributes from compiled output.
// This script restores them so downstream ESM consumers (e.g. Jest 30+) work correctly.
import { readFileSync, writeFileSync } from 'node:fs'

const file = 'build/esm/src/index.js'
const original = readFileSync(file, 'utf-8')
const patched = original.replace(
  /from '(\.\/[^']+\.json)';/g,
  "from '$1' with { type: 'json' };",
)
writeFileSync(file, patched)
