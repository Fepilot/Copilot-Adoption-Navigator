// Script to add .nojekyll file to out directory
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const nojekyllPath = resolve(process.cwd(), 'out', '.nojekyll')
writeFileSync(nojekyllPath, '')
console.log('✅ Created .nojekyll file in out directory')
