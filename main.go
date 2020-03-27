package main

import (
	"github.com/jessevdk/go-flags"
	"github.com/relecto/labeler/server"
	"log"
	"os"
)

type Options struct {
	Path string `short:"p" long:"data-path" env:"DATA_PATH" description:"Path to dataset" default:"."`
	Addr string `short:"l" long:"listen" env:"LISTEN" description:"Bind address and port, e.g. 0.0.0.0:8080" default:"0.0.0.0:8080"`
	StaticPath string `long:"static-path" env:"STATIC_PATH" default:"dist/"`
}

var opts Options

func main() {
	log.Print("[INFO] starting...")

	parser := flags.NewParser(&opts, flags.Default)
	if _, err := parser.Parse(); err != nil {
		if flagsErr, ok := err.(*flags.Error); ok && flagsErr.Type == flags.ErrHelp {
			os.Exit(1)
		}
	}
	server := server.NewServer(opts.Path, opts.StaticPath)
	log.Fatal(server.ListenAndServe(opts.Addr))
}
