package auth

import (
	"context"
	"errors"
	"time"
)

type tokenStruct struct {
	accessToken            string
	refreshToken           string
	accessTokenExpiryTime  time.Time
	refreshTokenExpiryTime time.Time
}

func newTokenStruct(tsNew *LoginResponse) *tokenStruct {
	return &tokenStruct{
		accessToken:            tsNew.AccessToken,
		refreshToken:           tsNew.RefreshToken,
		accessTokenExpiryTime:  time.Now().Add(time.Duration(tsNew.ExpiresIn) * time.Second),
		refreshTokenExpiryTime: time.Now().Add(time.Duration(tsNew.RefreshExpiresIn) * time.Second),
	}
}

func makeCacheKey(clientId, clientSecret, apiToken string) string {
	return clientId + clientSecret + apiToken
}

func (ea *ekaAuthProvider) getJwtToken(ctx context.Context, clientId, clientSecret, apiToken string) (string, error) {

	if clientSecret == "" {
		return "", errors.New("clientSecret cannot be empty")
	}

	if clientId == "" {
		return "", errors.New("clientId cannot be empty")
	}

	cacheKey := makeCacheKey(clientId, clientSecret, apiToken)
	cached, ok := ea.ekaJwtCache.Load(cacheKey)
	if !ok {
		return ea.getTokenBasedOnExpiry(ctx, nil)
	}

	cachedStruct, ok := cached.(*tokenStruct)
	if ok {
		return ea.getTokenBasedOnExpiry(ctx, cachedStruct)
	}

	return "", errors.New("error while getting token from cache")
}

func (ea *ekaAuthProvider) getTokenBasedOnExpiry(ctx context.Context, ts *tokenStruct) (string, error) {

	if ts != nil && ts.accessTokenExpiryTime.Before(time.Now()) {
		// Access token has not expired return the same token
		return ts.accessToken, nil
	}

	tsNew, err := ea.reLogin(ctx, ea.clientId, ea.clientSecret, ea.apiKey)
	if err != nil {
		return "", err
	}

	ts = newTokenStruct(tsNew)
	ea.ekaJwtCache.Store(makeCacheKey(ea.clientId, ea.clientSecret, ea.apiKey), ts)
	return ts.accessToken, nil
}
