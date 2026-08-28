package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1ProviderRequestBuilder builds and executes requests for operations under \golang\v1\provider
type V1ProviderRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// ByHip_id gets an item from the abdm_client/client.golang.v1.provider.item collection
func (m *V1ProviderRequestBuilder) ByHip_id(hip_id string) *V1ProviderWithHip_ItemRequestBuilder {
	urlTplParams := make(map[string]string)
	for idx, item := range m.BaseRequestBuilder.PathParameters {
		urlTplParams[idx] = item
	}
	if hip_id != "" {
		urlTplParams["hip_id"] = hip_id
	}
	return NewV1ProviderWithHip_ItemRequestBuilderInternal(urlTplParams, m.BaseRequestBuilder.RequestAdapter)
}

// NewV1ProviderRequestBuilderInternal instantiates a new ProviderRequestBuilder and sets the default values.
func NewV1ProviderRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ProviderRequestBuilder {
	m := &V1ProviderRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/provider", pathParameters),
	}
	return m
}

// NewV1ProviderRequestBuilder instantiates a new ProviderRequestBuilder and sets the default values.
func NewV1ProviderRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ProviderRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1ProviderRequestBuilderInternal(urlParams, requestAdapter)
}
