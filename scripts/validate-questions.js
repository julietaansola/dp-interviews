import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'public', 'data')

const schema = JSON.parse(readFileSync(join(dataDir, 'schema.json'), 'utf-8'))
const questionDef = schema.definitions.question

const dataFiles = readdirSync(dataDir).filter(
  f => f.endsWith('.json') && f !== 'schema.json'
)

if (dataFiles.length === 0) {
  console.log('No question files found to validate.')
  process.exit(0)
}

let hasErrors = false
const allIds = new Set()

function validateEnum(value, allowed, path) {
  if (!allowed.includes(value)) {
    console.error(`  ERROR ${path}: "${value}" not in [${allowed.join(', ')}]`)
    return false
  }
  return true
}

function validateQuestion(q, index, fileName) {
  const prefix = `  [${fileName}] question #${index + 1} (${q.id || 'NO ID'})`
  let valid = true

  // Required fields
  for (const field of questionDef.required) {
    if (q[field] === undefined || q[field] === null) {
      console.error(`${prefix}: missing required field "${field}"`)
      valid = false
    }
  }

  if (!valid) return false

  // ID format
  const idPattern = /^(dp|de)-[a-z0-9]+-(?:jr|ssr|sr)-\d{3}$/
  if (!idPattern.test(q.id)) {
    console.error(`${prefix}: id "${q.id}" doesn't match pattern {profile}-{tech}-{level}-{nnn}`)
    valid = false
  }

  // Duplicate ID
  if (allIds.has(q.id)) {
    console.error(`${prefix}: duplicate id "${q.id}"`)
    valid = false
  }
  allIds.add(q.id)

  // Enums
  if (!validateEnum(q.profile, ['data-platform', 'data-engineer'], `${prefix} profile`)) valid = false
  if (!validateEnum(q.level, ['jr', 'ssr', 'sr'], `${prefix} level`)) valid = false
  if (!validateEnum(q.difficulty, ['easy', 'medium', 'hard'], `${prefix} difficulty`)) valid = false

  // Arrays
  if (!Array.isArray(q.technology) || q.technology.length === 0) {
    console.error(`${prefix}: technology must be a non-empty array`)
    valid = false
  }
  if (!Array.isArray(q.key_points) || q.key_points.length === 0) {
    console.error(`${prefix}: key_points must be a non-empty array`)
    valid = false
  }

  // String lengths
  if (typeof q.question === 'string' && q.question.length < 10) {
    console.error(`${prefix}: question too short (min 10 chars)`)
    valid = false
  }
  if (typeof q.expected_answer === 'string' && q.expected_answer.length < 20) {
    console.error(`${prefix}: expected_answer too short (min 20 chars)`)
    valid = false
  }

  // No extra fields
  const allowedFields = Object.keys(questionDef.properties)
  for (const key of Object.keys(q)) {
    if (!allowedFields.includes(key)) {
      console.error(`${prefix}: unexpected field "${key}"`)
      valid = false
    }
  }

  return valid
}

for (const file of dataFiles) {
  console.log(`Validating ${file}...`)
  let data
  try {
    data = JSON.parse(readFileSync(join(dataDir, file), 'utf-8'))
  } catch (e) {
    console.error(`  ERROR: Invalid JSON in ${file}: ${e.message}`)
    hasErrors = true
    continue
  }

  // Top-level fields
  const requiredTop = schema.required
  for (const field of requiredTop) {
    if (data[field] === undefined) {
      console.error(`  ERROR: missing top-level field "${field}"`)
      hasErrors = true
    }
  }

  if (!data.questions || !Array.isArray(data.questions)) {
    console.error(`  ERROR: "questions" must be an array`)
    hasErrors = true
    continue
  }

  if (data.profile && !validateEnum(data.profile, ['data-platform', 'data-engineer'], `  [${file}] profile`)) {
    hasErrors = true
  }

  let fileErrors = 0
  data.questions.forEach((q, i) => {
    if (!validateQuestion(q, i, file)) fileErrors++
  })

  if (fileErrors > 0) {
    console.error(`  ${fileErrors} question(s) with errors`)
    hasErrors = true
  } else {
    console.log(`  ${data.questions.length} questions OK`)
  }
}

if (hasErrors) {
  console.error('\nValidation FAILED')
  process.exit(1)
} else {
  console.log(`\nValidation PASSED (${allIds.size} total questions)`)
}
