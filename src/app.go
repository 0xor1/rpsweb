package app

import (
	`log`
	`net/http`
	`bitbucket.org/0xor1/rps`
	`github.com/gorilla/mux`
	`golang.org/x/net/context`
)

func init() {
	log.Println(`Server Starting...`)
	baseRouter := mux.NewRouter()
	apiRouter := baseRouter.Methods(`POST`).PathPrefix(`/api`).Subrouter()
	rps.RouteGaeProd(apiRouter,  []string{`rck`, `ppr`, `scr`}, [][]int{[]int{1}, []int{-1, 1}}, 1000, `80e2cbc13f08431f`, `e5714989408a4f11`, `6d497021d03c4d66`, `316b7ee3c15046c7`, context.Background())
	http.Handle(`/`, baseRouter)
}
