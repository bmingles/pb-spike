const { DEFAULT_ALPHABET } = require(`./config.js`)

function dateStr(date) {
  return date.toISOString().replace('T', ' ')
}

function now() {
  return dateStr(new Date())
}

function baseCommon() {
  return {
    created: now(),
    updated: now(),
    type: 'base',
    system: false,
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
  }
}

function textField(overrides) {
  return {
    system: false,
    type: 'text',
    required: false,
    presentable: false,
    unique: false,
    ...overrides,
    options: {
      min: null,
      max: null,
      pattern: '',
      ...overrides.options,
    },
  }
}

function numberField(overrides) {
  return {
    system: false,
    type: 'number',
    required: false,
    presentable: false,
    unique: false,
    ...overrides,
    options: {
      min: null,
      max: null,
      noDecimal: false,
      ...overrides.options,
    },
  }
}

function dateField(overrides) {
  return {
    system: false,
    type: 'date',
    required: false,
    presentable: false,
    unique: false,
    ...overrides,
    options: {
      min: '',
      max: '',
      ...overrides.options,
    },
  }
}

function selectField(overrides) {
  return {
    system: false,
    type: 'select',
    required: false,
    presentable: false,
    unique: false,
    ...overrides,
    options: {
      maxSelect: 1,
      values: [],
      ...overrides.options,
    },
  }
}

function relationField(overrides, optionsOverrides) {
  return {
    system: false,
    type: 'relation',
    required: false,
    presentable: false,
    unique: false,
    options: {
      cascadeDelete: false,
      minSelect: null,
      maxSelect: 1,
      displayFields: null,
      ...optionsOverrides,
    },
    ...overrides,
  }
}

function uniqueIndex({ id, collectionName, fieldNames }) {
  const idStr =
    id ??
    `idx_unique_${$security.randomStringWithAlphabet(7, DEFAULT_ALPHABET)}`

  const fieldNamesStr = fieldNames.map((f) => `\`${f}\``).join(', ')

  return `CREATE UNIQUE INDEX \`${idStr}\` ON \`${collectionName}\` (${fieldNamesStr})`
}

module.exports = {
  dateStr,
  now,
  baseCommon,
  textField,
  numberField,
  dateField,
  relationField,
  selectField,
  uniqueIndex,
}
