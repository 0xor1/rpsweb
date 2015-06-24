package app

import (
	"log"
	"net/http"
	"github.com/0xor1/gameseed/src/server/lib/mux"
	//"github.com/0xor1/gameseed/src/server/src/apiv1game"
	//"github.com/0xor1/gameseed/src/server/src/cloudstore"
)

func init() {
	log.Println("Server Starting...")
	baseRouter := mux.NewRouter()
	//apiRouter := baseRouter.Methods("POST").Subrouter()
	//apiv1game.Route(apiRouter, &cloudstore.GameStore{})
	http.Handle("/", baseRouter)
}
