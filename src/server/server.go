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
	apiRouter := domainRouter.PathPrefix(`/api`).Subrouter()
	domainRouter.PathPrefix(`/`).Handler(fileServer)

	rps.RouteLocalTest(apiRouter, []string{`rck`, `ppr`, `scr`}, [][]int{[]int{1}, []int{-1, 1}}, 1000, `80e2cbc13f08431f`, `e5714989408a4f11`, `6d497021d03c4d66`, `316b7ee3c15046c7`)

	http.Handle(`/`, baseRouter)
	log.Println(`Server Listening on Port: ` + listenPort)
	http.ListenAndServe(`:` + listenPort, nil)
}