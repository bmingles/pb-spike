/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const { COLLECTION_NAME } = require(`./pb_hooks/config.js`)

    const dao = new Dao(db)

    const { id: subscriptionId } = dao.findCollectionByNameOrId(
      COLLECTION_NAME.SUBSCRIPTION,
    )

    const collection = dao.findCollectionByNameOrId('_pb_users_auth_')

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: 'ccojwjrq',
        name: 'skus',
        type: 'json',
        required: false,
        presentable: false,
        unique: false,
        options: {
          maxSize: 2000000,
        },
      }),
    )

    // add
    collection.schema.addField(
      new SchemaField({
        system: false,
        id: 'fgwjyq96',
        name: 'subs',
        type: 'relation',
        required: false,
        presentable: false,
        unique: false,
        options: {
          collectionId: subscriptionId,
          cascadeDelete: false,
          minSelect: null,
          maxSelect: null,
          displayFields: null,
        },
      }),
    )

    return dao.saveCollection(collection)
  },
  (db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId('_pb_users_auth_')

    // remove
    collection.schema.removeField('ccojwjrq')

    // remove
    collection.schema.removeField('fgwjyq96')

    return dao.saveCollection(collection)
  },
)
