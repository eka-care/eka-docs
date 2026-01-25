package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1ProfileAssetRequestBuilder builds and executes requests for operations under \golang\v1\profile\asset
type V1ProfileAssetRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// Card the card property
func (m *V1ProfileAssetRequestBuilder) Card() *V1ProfileAssetCardRequestBuilder {
	return NewV1ProfileAssetCardRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// NewV1ProfileAssetRequestBuilderInternal instantiates a new AssetRequestBuilder and sets the default values.
func NewV1ProfileAssetRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ProfileAssetRequestBuilder {
	m := &V1ProfileAssetRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/profile/asset", pathParameters),
	}
	return m
}

// NewV1ProfileAssetRequestBuilder instantiates a new AssetRequestBuilder and sets the default values.
func NewV1ProfileAssetRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ProfileAssetRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1ProfileAssetRequestBuilderInternal(urlParams, requestAdapter)
}

// Qr the qr property
func (m *V1ProfileAssetRequestBuilder) Qr() *V1ProfileAssetQrRequestBuilder {
	return NewV1ProfileAssetQrRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}
