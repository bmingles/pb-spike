package main

import (
	"log"
	"os"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/jsvm"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

func main() {
    app := pocketbase.New()

    var hooksDir string
	app.RootCmd.PersistentFlags().StringVar(
		&hooksDir,
		"hooksDir",
		"",
		"the directory with the JS app hooks",
	)

	var hooksWatch bool
	app.RootCmd.PersistentFlags().BoolVar(
		&hooksWatch,
		"hooksWatch",
		true,
		"auto restart the app on pb_hooks file change",
	)

    var migrationsDir string
	app.RootCmd.PersistentFlags().StringVar(
		&migrationsDir,
		"migrationsDir",
		"",
		"the directory with the user defined migrations",
	)

    var automigrate bool
	app.RootCmd.PersistentFlags().BoolVar(
		&automigrate,
		"automigrate",
		true,
		"enable/disable auto migrations",
	)

    // load jsvm (hooks and migrations)
	jsvm.MustRegister(app, jsvm.Config{
		MigrationsDir: migrationsDir,
	})

    // migrate command (with js templates)
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		TemplateLang: migratecmd.TemplateLangJS,
		Automigrate:  automigrate,
		Dir:          migrationsDir,
	})

    // serves static files from the provided public dir (if exists)
    app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
        e.Router.GET("/", func(c echo.Context) error {
            return c.String(404, "Not Found")
        })

        e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))

        return nil
    })

    if err := app.Start(); err != nil {
        log.Fatal(err)
    }
}
