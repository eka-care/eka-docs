package auth

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

type loginReq struct {
	ClientId     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	ApiKey       string `json:"api_key"`
}

type LoginResponse struct {
	AccessToken      string `json:"access_token"`
	ExpiresIn        int    `json:"expires_in"`
	RefreshExpiresIn int    `json:"refresh_expires_in"`
	RefreshToken     string `json:"refresh_token"`
}

func (ea *ekaAuthProvider) reLogin(ctx context.Context, clientId, clientSecret, apiToken string) (
	*LoginResponse, error) {

	url := fmt.Sprintf("%s/connect-auth/v1/account/login", ea.host)

	lr := loginReq{
		ClientId:     clientId,
		ClientSecret: clientSecret,
		ApiKey:       apiToken,
	}
	lrJson, err := json.Marshal(lr)
	if err != nil {
		return nil, err
	}

	req, _ := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(lrJson))

	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()

	loginResp := &LoginResponse{}
	err = json.NewDecoder(res.Body).Decode(loginResp)
	if err != nil {
		return nil, err
	}

	return loginResp, nil
}
