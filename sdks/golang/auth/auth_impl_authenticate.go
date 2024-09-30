package auth

import (
	"context"
	"errors"
	kiota_abs "github.com/microsoft/kiota-abstractions-go"
)

func (ea *ekaAuthProvider) AuthenticateRequest(ctx context.Context, request *kiota_abs.RequestInformation,
	additionalAuthenticationContext map[string]interface{}) error {

	if request == nil {
		return errors.New("request cannot be nil")
	}

	// Get the JWT token
	token, err := ea.getJwtToken(ctx, ea.clientId, ea.clientSecret, ea.apiKey)
	if err != nil {
		return err
	}

	request.Headers.Add("auth", token)
	return nil
}
