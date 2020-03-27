package server

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type FileMeta struct {
	Selections []struct {
		X int `json:"x"`
		Y int `json:"y"`
		Width int `json:"width"`
		Height int `json:"height"`
		Category string `json:"category"`
	} `json:"selections"`
	Meta struct {
		LabeledBy string `json:"labeledBy,omitempty"`
		LastEdited string `json:"lastEdited,omitempty"`
	} `json:"meta"`
}

type Server struct {
	dataPath string
	staticPath string
	mux *http.ServeMux
}

func NewServer(dataPath, staticPath string) *Server {
	mux := http.NewServeMux()

	return &Server{
		dataPath: dataPath,
		staticPath: staticPath,
		mux: mux,
	}
}

func (s *Server) listFiles(w http.ResponseWriter, r *http.Request) {
	files := make([]string, 0)
	err := filepath.Walk(s.dataPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() ||
			strings.HasSuffix(info.Name(), ".meta.json") ||
			strings.HasSuffix(info.Name(), ".lock") {
			return nil
		}

		rel, err := filepath.Rel(s.dataPath, path)
		if err != nil {
			return err
		}

		files = append(files, rel)
		return nil
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	res, err := json.Marshal(files)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func (s *Server) getData(w http.ResponseWriter, r *http.Request) {
	filename := strings.TrimPrefix(r.URL.Path, "/data/")

	datafile := filepath.Join(s.dataPath, filename) + ".meta.json"
	_, err := os.Stat(datafile)
	if err != nil {
		http.NotFound(w, r)
		return
	}

	http.ServeFile(w, r, datafile)
}

func (s *Server) postData(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var data FileMeta

	err := decoder.Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	data.Meta.LabeledBy = r.Header.Get("x-labeler-username")
	data.Meta.LastEdited = time.Now().Format(time.RFC3339)

	content, err := json.Marshal(data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	filename := strings.TrimPrefix(r.URL.Path, "/data/")

	datafile := filepath.Join(s.dataPath, filename) + ".meta.json"
	err = ioutil.WriteFile(datafile, content, 0644)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
}

func (s *Server) data(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		s.getData(w, r)
	case http.MethodPost:
		s.postData(w, r)
	}
}

func (s *Server) init() {
	s.mux.Handle("/",
		http.FileServer(http.Dir(s.staticPath)),
	)
	s.mux.Handle("/img/",
		http.StripPrefix("/img/", http.FileServer(http.Dir(s.dataPath))),
	)
	s.mux.HandleFunc("/img", s.listFiles)
	s.mux.HandleFunc("/data/", s.data)


}

func (s *Server) ListenAndServe(addr string) error {
	s.init()
	return http.ListenAndServe(addr, s.mux)
}