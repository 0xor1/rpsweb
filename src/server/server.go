package main

import (
	`log`
	`net/http`
	`github.com/gorilla/mux`
	`github.com/0xor1/rps`
)

const (
	domain 		= `rpsweb-1.appspot.com`
	listenPort  = `8080`
)

func main() {
	log.Println(`Server Starting...`)

	baseRouter := mux.NewRouter()
	fileServer := http.FileServer(http.Dir(`../client`))

	domainRouter := baseRouter.Host(domain).Subrouter()
	domainRouter.Methods(`GET`).PathPrefix(`/`).Handler(fileServer)

	apiRouter := domainRouter.Methods(`POST`).PathPrefix(`/api`).Subrouter()
	rps.RouteLocalTest(apiRouter)

	http.Handle(`/`, baseRouter)
	log.Println(`Server Listening on Port: ` + listenPort)
	http.ListenAndServe(`:` + listenPort, nil)
}