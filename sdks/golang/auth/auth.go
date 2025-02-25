package auth

import (
	"github.com/microsoft/kiota-abstractions-go/authentication"
	"sync"
)

type EkaJwtProvider interface {
	authentication.AuthenticationProvider
}

type ekaAuthProvider struct {

	// Connect Client Id
	clientId string

	// Connect Client Secret
	clientSecret string

	// API Token
	apiKey string

	// in memory cache to hold jwt for reuse
	ekaJwtCache *sync.Map

	// Eka API host for Auth request.
	host string
}

func NewEkaJWTProvider(clientId, clientSecret, apiKey string) (EkaJwtProvider, error) {
	return &ekaAuthProvider{
		apiKey:       apiKey,
		clientId:     clientId,
		clientSecret: clientSecret,
		ekaJwtCache:  &sync.Map{},
	}, nil
}
