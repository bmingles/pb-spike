/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const { COLLECTION_NAME } = require(`./pb_hooks/config.js`)

    const email = process.env.PB_USER_EMAIL
    const password = process.env.PB_USER_PWD

    if (!email || !password) {
      throw new Error('User email and password required')
    }

    const dao = new Dao(db)

    const organizations = dao.findCollectionByNameOrId(
      COLLECTION_NAME.ORGANIZATION,
    )
    const products = dao.findCollectionByNameOrId(COLLECTION_NAME.PRODUCT)
    const subscriptions = dao.findCollectionByNameOrId(
      COLLECTION_NAME.SUBSCRIPTION,
    )
    const productTypes = dao.findCollectionByNameOrId(
      COLLECTION_NAME.PRODUCT_TYPE,
    )
    const subscriptionTypes = dao.findCollectionByNameOrId(
      COLLECTION_NAME.SUBSCRIPTION_TYPE,
    )

    // CheckIn
    const services = dao.findCollectionByNameOrId(COLLECTION_NAME.SERVICE)
    const classes = dao.findCollectionByNameOrId(COLLECTION_NAME.CLASS)
    const grades = dao.findCollectionByNameOrId(COLLECTION_NAME.GRADE)
    const phoneNumbers = dao.findCollectionByNameOrId(
      COLLECTION_NAME.PHONE_NUMBER,
    )
    const families = dao.findCollectionByNameOrId(COLLECTION_NAME.FAMILY)
    const people = dao.findCollectionByNameOrId(COLLECTION_NAME.PERSON)
    // const attendance = dao.findCollectionByNameOrId()

    // Product types
    const curriculumProductType = new Record(productTypes, {
      name: 'curriculum',
    })
    const serviceProductType = new Record(productTypes, {
      name: 'service',
    })
    ;[curriculumProductType, serviceProductType].forEach((record) => {
      dao.saveRecord(record)
    })

    // Subscription types
    const oneTimeSubscriptionType = new Record(subscriptionTypes, {
      name: 'oneTime',
    })
    const monthlySubscriptionType = new Record(subscriptionTypes, {
      name: 'monthly',
    })
    ;[oneTimeSubscriptionType, monthlySubscriptionType].forEach((record) => {
      dao.saveRecord(record)
    })

    // Organization

    const acmeOrg = new Record(organizations, {
      name: 'Acme',
      slug: 'acme',
    })

    const hinkleOrg = new Record(organizations, {
      name: 'Hinkle',
      slug: 'hinkle',
    })

    // Products

    const checkInProduct = new Record(products, {
      name: 'Check-In',
      sku: 'CHECKIN',
      type: serviceProductType.id,
      subscriptionType: monthlySubscriptionType.id,
    })

    ;[acmeOrg, hinkleOrg, checkInProduct].forEach((record) => {
      dao.saveRecord(record)
    })

    // Subscriptions

    const checkInSubscription = new Record(subscriptions, {
      product: checkInProduct.id,
      org: acmeOrg.id,
      type: monthlySubscriptionType.id,
    })
    const checkInSubscription2 = new Record(subscriptions, {
      product: checkInProduct.id,
      org: hinkleOrg.id,
      type: monthlySubscriptionType.id,
    })

    ;[checkInSubscription, checkInSubscription2].forEach((record) => {
      dao.saveRecord(record)
    })

    // Users KMT

    const usersKmt = dao.findCollectionByNameOrId(COLLECTION_NAME.USERS_KMT)

    const checkinTestUser = new Record(usersKmt)
    checkinTestUser.setUsername('checkintest.user')
    checkinTestUser.setEmail(email)
    checkinTestUser.setPassword(password)
    checkinTestUser.setVerified(true)
    checkinTestUser.set('subs', [
      checkInSubscription.id,
      checkInSubscription2.id,
    ])

    const checkinTestUser2 = new Record(usersKmt)
    checkinTestUser2.setUsername('checkintest.user2')
    checkinTestUser2.setEmail(email.replace('@', '2@'))
    checkinTestUser2.setPassword(password)
    checkinTestUser2.setVerified(true)
    checkinTestUser2.set('subs', [checkInSubscription.id])
    ;[checkinTestUser, checkinTestUser2].forEach((record) => {
      dao.saveRecord(record)
    })

    /* Services */
    const service9 = new Record(services, {
      org: acmeOrg.id,
      name: 'Sunday 9:00',
      time: '09:00:00',
      order: 0,
    })
    const service11 = new Record(services, {
      org: acmeOrg.id,
      name: 'Sunday 11:00',
      time: '11:00:00',
      order: 1,
    })

    ;[service9, service11].forEach((record) => {
      dao.saveRecord(record)
    })

    /** Grades */
    const gradesData = [
      ['Nursery', 'Nur'],
      ['Preschool 2', 'Pre-2'],
      ['Preschool 3', 'Pre-3'],
      ['Preschool 4', 'Pre-4'],
      ['Kindergarten', 'K-5'],
      ['First Grade', '1st'],
      ['Second Grade', '2nd'],
      ['Third Grade', '3rd'],
      ['Fourth Grade', '4th'],
      ['Fifth Grade', '5th'],
      ['Sixth Grade', '6th'],
      ['Seventh Grade', '7th'],
      ['Eighth Grade', '8th'],
      ['Ninth Grade', '9th'],
      ['Tenth Grade', '10th'],
      ['Eleventh Grade', '11th'],
      ['Twelfth Grade', '12th'],
    ].map(
      ([name, abbrev], i) =>
        new Record(grades, {
          org: acmeOrg.id,
          name,
          abbrev,
          entryAge: i + (i && 1),
          order: i,
        }),
    )

    const classData = [
      [service9.id, 'Preschool', 'Pre', 2, undefined],
      [service9.id, 'Elementary', 'Elem', undefined, 5],
      [service9.id, 'Middle School', 'Middle', undefined, 10],
      [service11.id, 'Preschool', 'Pre', 2, undefined],
      [service11.id, 'Elementary', 'Elem', undefined, 5],
      [service11.id, 'Middle School', 'Middle', undefined, 10],
    ].map(
      ([service, name, abbrev, entryAge, entryGradeIndex], i) =>
        new Record(classes, {
          org: acmeOrg.id,
          service,
          name,
          abbrev,
          entryAge,
          entryGradeIndex,
          order: i,
        }),
    )

    ;[...gradesData, ...classData].forEach((record) => {
      dao.saveRecord(record)
    })

    /* Phone Numbers */
    const phoneNumberValues = []
    for (let i = 0; i < 100; ++i) {
      phoneNumberValues.push(
        new Record(phoneNumbers, {
          org: acmeOrg.id,
          number: `+1 000000${String(i).padStart(4, '0')}`,
        }),
      )
    }

    phoneNumberValues.forEach((record) => {
      dao.saveRecord(record)
    })

    /* Families */

    const firstNames = ['John', 'Jimmy', 'Jenny', 'Joel', 'Jerry', 'Jeffery']

    let phoneNumberCount = 0

    function createPeople(org, family, last, type, n) {
      const peopleRecords = []

      // const lastName = lastNames[Math.random() * n % lastNames.length]
      for (let i = 0; i < n; ++i) {
        const first = firstNames[Math.floor(Math.random() * firstNames.length)]
        peopleRecords.push(
          new Record(people, {
            org: org.id,
            type,
            family: family.id,
            first,
            last,
            phoneNumbers: phoneNumberValues[phoneNumberCount]
              ? [phoneNumberValues[phoneNumberCount].id]
              : undefined,
          }),
        )
        ++phoneNumberCount
      }

      peopleRecords.forEach((record) => {
        dao.saveRecord(record)
      })

      const members = peopleRecords.map(({ id }) => id)
      family.set('members', [...family.get('members'), ...members])

      dao.saveRecord(family)
    }

    function createFamily(org, last, adultCount, childCount) {
      const family = new Record(families, {
        org: org.id,
      })
      dao.saveRecord(family)

      createPeople(acmeOrg, family, last, 'adult', adultCount)
      createPeople(acmeOrg, family, last, 'child', childCount)
    }

    createFamily(acmeOrg, 'Jones', 2, 4)
    createFamily(acmeOrg, 'Smith', 1, 2)

    // createPeople(acmeOrg, familyJones, 'Jones', 'adult', 2)
    // createPeople(acmeOrg, familyJones, 'Jones', 'child', 4)
    // createPeople(acmeOrg, familyJones, 'Jones', 'adult', 1)
  },
  (db) => {
    const dao = new Dao(db)
  },
)
