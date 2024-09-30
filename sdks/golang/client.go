package abdm_client

import (
	"context"
	tokenprovider "github.com/eka-care/eka-docs/sdks/golang/auth"
	"github.com/eka-care/eka-docs/sdks/golang/client"
	bundle "github.com/microsoft/kiota-bundle-go"
)

func EkaClient(ctx context.Context, clientId, clientSecret, apiKey string) (*client.AbdmClient, error) {

	ekaJwtProvider, err := tokenprovider.NewEkaJWTProvider(clientId, clientSecret, apiKey)
	if err != nil {
		return nil, err
	}

	// Create request adapter
	kiotaRequestAdapter, err := bundle.NewDefaultRequestAdapter(ekaJwtProvider)
	if err != nil {
		return nil, err
	}

	// Create the API client
	ekaClient := client.NewAbdmClient(kiotaRequestAdapter)

	return ekaClient, nil
}
