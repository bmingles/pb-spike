/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const { COLLECTION_NAME } = require(`./pb_hooks/config.js`)

    const {
      baseCommon,
      dateField,
      numberField,
      selectField,
      textField,
      relationField,
      uniqueIndex,
    } = require(`./pb_hooks/util.js`)

    const dao = new Dao(db)

    const organizations = dao.findCollectionByNameOrId(
      COLLECTION_NAME.ORGANIZATION,
    )

    /* Services */

    const services = new Collection({
      ...baseCommon(),
      name: COLLECTION_NAME.SERVICE,
      schema: [
        relationField(
          { name: 'org', required: true },
          { collectionId: organizations.id },
        ),
        textField({ name: 'name', required: true }),
        textField({
          name: 'time',
          required: true,
          options: {
            pattern: '^\\d\\d:\\d\\d:\\d\\d',
          },
        }),
        numberField({ name: 'order', required: true }),
      ],
    })

    services.listRule = '@request.auth.subs.org.id ?= org'
    services.viewRule = '@request.auth.subs.org.id ?= org'
    // services.updateRule = '@request.auth.subs.org.id ?= org'

    dao.saveCollection(services)

    /* Class */
    const classes = new Collection({
      ...baseCommon(),
      name: COLLECTION_NAME.CLASS,
      schema: [
        relationField(
          { name: 'org', required: true },
          { collectionId: organizations.id },
        ),
        relationField(
          { name: 'service', required: true },
          { collectionId: services.id },
        ),
        textField({ name: 'name', required: true }),
        textField({ name: 'abbrev', required: true }),
        numberField({ name: 'entryAge' }),
        numberField({ name: 'entryGradeIndex' }),
        numberField({ name: 'order', required: true }),
      ],
    })

    classes.listRule = '@request.auth.subs.org.id ?= org'
    classes.viewRule = '@request.auth.subs.org.id ?= org'

    dao.saveCollection(classes)

    /* Grade */
    const grades = new Collection({
      ...baseCommon(),
      name: COLLECTION_NAME.GRADE,
      schema: [
        relationField(
          { name: 'org', required: true },
          { collectionId: organizations.id },
        ),
        textField({ name: 'name', required: true }),
        textField({ name: 'abbrev', required: true }),
        numberField({ name: 'entryAge', required: true }),
        // TODO: These seem to need to be calculated real time. Can probably
        // remove
        // dateField({ name: 'minBirthdate', required: true }),
        // dateField({ name: 'maxBirthdate', required: true }),
        numberField({ name: 'order', required: true }),
      ],
    })

    grades.listRule = '@request.auth.subs.org.id ?= org'
    grades.viewRule = '@request.auth.subs.org.id ?= org'

    dao.saveCollection(grades)

    /* PhoneNumber */
    const phoneNumbers = new Collection({
      ...baseCommon(),
      name: COLLECTION_NAME.PHONE_NUMBER,
      schema: [
        relationField(
          { name: 'org', required: true },
          { collectionId: organizations.id },
        ),
        textField({ name: 'number', required: true, presentable: true }),
      ],
      indexes: [
        uniqueIndex({
          collectionName: COLLECTION_NAME.PHONE_NUMBER,
          fieldNames: ['org', 'number'],
        }),
      ],
    })

    phoneNumbers.listRule = '@request.auth.subs.org.id ?= org'
    phoneNumbers.viewRule = '@request.auth.subs.org.id ?= org'

    dao.saveCollection(phoneNumbers)

    /* Families */

    const families = new Collection({
      ...baseCommon(),
      name: COLLECTION_NAME.FAMILY,
      schema: [
        relationField(
          { name: 'org', required: true },
          { collectionId: organizations.id },
        ),
      ],
    })

    families.listRule = '@request.auth.subs.org.id ?= org'
    families.viewRule = '@request.auth.subs.org.id ?= org'

    dao.saveCollection(families)

    /* People */

    const people = new Collection({
      ...baseCommon(),
      name: COLLECTION_NAME.PERSON,
      schema: [
        relationField(
          { name: 'org', required: true },
          { collectionId: organizations.id },
        ),
        selectField({
          name: 'type',
          options: {
            values: ['adult', 'child'],
          },
        }),
        relationField(
          { name: 'family', required: true },
          { collectionId: families.id },
        ),
        textField({ name: 'first', required: true, presentable: true }),
        textField({ name: 'last', required: true }),
        dateField({ name: 'birthDate' }),
        relationField({ name: 'grade' }, { collectionId: grades.id }),
        relationField(
          { name: 'classes' },
          { collectionId: classes.id, maxSelect: null },
        ),
        relationField(
          { name: 'phoneNumbers' },
          { collectionId: phoneNumbers.id, maxSelect: null },
        ),
        textField({ name: 'labelNote' }),
      ],
    })

    people.listRule = '@request.auth.subs.org.id ?= org'
    people.viewRule = '@request.auth.subs.org.id ?= org'

    dao.saveCollection(people)

    /* Family amend */
    families.schema.addField(
      relationField(
        { name: 'members' },
        { collectionId: people.id, maxSelect: null },
      ),
    )

    dao.saveCollection(families)

    /* Attendance */

    const attendances = new Collection({
      name: COLLECTION_NAME.ATTENDANCE,
      schema: [
        dateField({ name: 'date', required: true }),
        relationField(
          { name: 'org', required: true },
          { collectionId: organizations.id },
        ),
        relationField(
          { name: 'service', required: true },
          { collectionId: services.id },
        ),
        relationField(
          { name: 'class', required: true },
          { collectionId: classes.id },
        ),
        relationField(
          { name: 'family', required: true },
          { collectionId: families.id },
        ),
        relationField(
          { name: 'guardian', required: true },
          { collectionId: people.id },
        ),
        relationField(
          { name: 'child', required: true },
          { collectionId: people.id },
        ),
      ],
    })

    attendances.listRule = '@request.auth.subs.org.id ?= org'
    attendances.viewRule = '@request.auth.subs.org.id ?= org'

    dao.saveCollection(attendances)
  },
  (db) => {
    const dao = new Dao(db)

    ;[COLLECTION_NAME.ATTENDANCE, COLLECTION_NAME.SERVICE].forEach((name) => {
      dao.deleteCollection(dao.findCollectionByNameOrId(name))
    })
  },
)
