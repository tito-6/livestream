package rtmp

import (
	"log"
	"net/http"
	"sync"

	"github.com/google/uuid"
	"github.com/nareix/joy4/av/avutil"
	"github.com/nareix/joy4/av/pubsub"
	"github.com/nareix/joy4/format/flv"
	"github.com/nareix/joy4/format/rtmp"
)

type Server struct {
	server *rtmp.Server
	queue  *pubsub.Queue
	lock   sync.Mutex
}

func NewRtmpServer(port string) *Server {
	s := &rtmp.Server{
		Addr: ":" + port,
	}

	srv := &Server{
		server: s,
		queue:  pubsub.NewQueue(),
	}

	s.HandlePublish = func(conn *rtmp.Conn) {
		log.Println("RTMP Publish connected from", conn.NetConn().RemoteAddr())
		log.Println("Stream Key/Path:", conn.URL.Path)

		streams, _ := conn.Streams()
		srv.queue.WriteHeader(streams)

		avutil.CopyFile(srv.queue, conn)

		log.Println("RTMP Disconnected")
		srv.queue.Close()
		srv.queue = pubsub.NewQueue() // Reset queue for next stream
	}

	return srv
}

func (s *Server) Start() {
	// Start RTMP Listener
	go func() {
		log.Println("RTMP Server listening on", s.server.Addr)
		if err := s.server.ListenAndServe(); err != nil {
			log.Println("RTMP Server Error:", err)
		}
	}()

	// Start HTTP-FLV Handler
	// We will attach this to the default http mux since we are running in the same process,
	// but main.go sets up a separate Gin router.
	// We should expose a method to register the handler or start a separate HTTP listener for video.
	// For simplicity, let's start a dedicated video port on :8081 if possible, or assume main.go will call us.
	// Actually, main.go uses Gin. We can provide a Gin handler.
}

func (s *Server) HandleFLV(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "video/x-flv")
	w.Header().Set("Transfer-Encoding", "chunked")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(200)

	flvWriter := flv.NewMuxer(w)
	cursor := s.queue.Latest()

	avutil.CopyFile(flvWriter, cursor)
}

func (s *Server) Stop() {
}

func GenerateStreamKey() (string, error) {
	return "live_" + uuid.New().String(), nil
}
