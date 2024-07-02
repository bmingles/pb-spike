/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const { COLLECTION_NAME } = require(`./pb_hooks/config.js`)

    const {
      baseCommon,
      dateField,
      textField,
      relationField,
      uniqueIndex,
    } = require(`./pb_hooks/util.js`)

    const dao = new Dao(db)

    /* Product types */

    const productTypes = new Collection({
      name: COLLECTION_NAME.PRODUCT_TYPE,
      schema: [textField({ name: 'name' })],
      indexes: [
        uniqueIndex({
          collectionName: COLLECTION_NAME.PRODUCT_TYPE,
          fieldNames: ['name'],
        }),
      ],
    })

    dao.saveCollection(productTypes)

    /* Subscription types */

    const subscriptionTypes = new Collection({
      ...baseCommon(),
      name: COLLECTION_NAME.SUBSCRIPTION_TYPE,
      schema: [textField({ name: 'name' })],
      indexes: [
        uniqueIndex({
          collectionName: COLLECTION_NAME.SUBSCRIPTION_TYPE,
          fieldNames: ['name'],
        }),
      ],
    })

    dao.saveCollection(subscriptionTypes)

    /* Organizations */

    const organizations = new Collection({
      ...baseCommon(),
      name: COLLECTION_NAME.ORGANIZATION,
      schema: [
        textField({ name: 'name', required: true }),
        textField({ name: 'slug', required: true }),
      ],
      indexes: [
        uniqueIndex({
          collectionName: COLLECTION_NAME.ORGANIZATION,
          fieldNames: ['slug'],
        }),
      ],
    })

    organizations.listRule = '@request.auth.subs.org.id ?= id'
    organizations.updateRule = '@request.auth.subs.org.id ?= id'
    organizations.viewRule = '@request.auth.subs.org.id ?= id'

    dao.saveCollection(organizations)

    /* Products */

    const products = new Collection({
      ...baseCommon(),
      name: COLLECTION_NAME.PRODUCT,
      schema: [
        textField({ name: 'name' }),
        textField({ name: 'sku' }),
        relationField({ name: 'type' }, { collectionId: productTypes.id }),
        relationField(
          { name: 'subscriptionType' },
          { collectionId: subscriptionTypes.id },
        ),
      ],
      indexes: [
        uniqueIndex({
          collectionName: COLLECTION_NAME.PRODUCT,
          fieldNames: ['sku'],
        }),
      ],
    })

    products.listRule = '@request.auth.subs.product.id ?= id'
    products.viewRule = '@request.auth.subs.product.id ?= id'

    dao.saveCollection(products)

    /* Subscriptions */

    const subscriptions = new Collection({
      ...baseCommon(),
      name: COLLECTION_NAME.SUBSCRIPTION,
      schema: [
        relationField({ name: 'type' }, { collectionId: subscriptionTypes.id }),
        relationField({ name: 'product' }, { collectionId: products.id }),
        relationField({ name: 'org' }, { collectionId: organizations.id }),
        dateField({ name: 'start' }),
        dateField({ name: 'end' }),
      ],
    })

    subscriptions.listRule = '@request.auth.subs.id ?= id'
    subscriptions.viewRule = '@request.auth.subs.id ?= id'

    dao.saveCollection(subscriptions)
  },
  (db) => {
    const dao = new Dao(db)

    ;[
      COLLECTION_NAME.PRODUCT_TYPE,
      COLLECTION_NAME.SUBSCRIPTION_TYPE,
      COLLECTION_NAME.ORGANIZATION,
      COLLECTION_NAME.PRODUCT,
      COLLECTION_NAME.SUBSCRIPTION,
    ].forEach((name) => {
      dao.deleteCollection(dao.findCollectionByNameOrId(name))
    })
  },
)
