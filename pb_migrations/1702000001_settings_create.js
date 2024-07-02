/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)

  const settings = dao.findSettings()
  settings.meta.appName = 'Mysite'
  settings.logs.maxDays = 0 // This seems to helps avoid memory issues
  settings.recordAuthToken.duration = 60 * 60

  dao.saveSettings(settings)
})
