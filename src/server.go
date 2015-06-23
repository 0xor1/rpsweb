package main

import (
	`log`
	`net/http`
	`github.com/0xor1/gameseed/src/server/lib/mux`
	`github.com/0xor1/gameseed/src/server/src/api`
	`github.com/0xor1/gameseed/src/server/src/session`
	`github.com/0xor1/gameseed/src/server/src/store`
	`github.com/0xor1/gameseed/src/server/src/game`
)

const (
	domain 		= `rpsweb-1.appspot.com`
	listenPort  = `8080`
)

func main() {
	log.Println(`Server Starting...`)

	baseRouter := mux.NewRouter()
	fileServer := http.FileServer(http.Dir(`./client`))

	domainRouter := baseRouter.Host(domain).Subrouter()
	domainRouter.Methods(`GET`).PathPrefix(`/`).Handler(fileServer)

	apiRouter := domainRouter.Methods(`POST`).Subrouter()
	api.Route(
		apiRouter,
		store.NewLocalMemoryStore(game.New),
		session.GetStore(
			game.New(),
			`6455d34dy2e1cx47`,
			`54a1e479w2eb3z4b`,
			true,
			300,
		),
	)

	http.Handle(`/`, baseRouter)
	log.Println(`Server Listening on Port: ` + listenPort)
	http.ListenAndServe(`:` + listenPort, nil)
}