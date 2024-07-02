/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const adminEmail = process.env.PB_ADMIN_EMAIL
    const pwd = process.env.PB_ADMIN_PWD

    if (!adminEmail || !pwd) {
      throw new Error(`Admin email and password required`)
    }

    const admin = new Admin()

    admin.email = adminEmail
    admin.setPassword(pwd)

    return Dao(db).saveAdmin(admin)
  },
  (db) => {
    const dao = new Dao(db)

    const admin = dao.findAdminByEmail(email)

    return dao.deleteAdmin(admin)
  },
)
