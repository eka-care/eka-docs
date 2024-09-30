package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// AbdmRequestBuilder builds and executes requests for operations under \golang
type AbdmRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// NewAbdmRequestBuilderInternal instantiates a new AbdmRequestBuilder and sets the default values.
func NewAbdmRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *AbdmRequestBuilder {
	m := &AbdmRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang", pathParameters),
	}
	return m
}

// NewAbdmRequestBuilder instantiates a new AbdmRequestBuilder and sets the default values.
func NewAbdmRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *AbdmRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewAbdmRequestBuilderInternal(urlParams, requestAdapter)
}

// V1 the v1 property
func (m *AbdmRequestBuilder) V1() *V1RequestBuilder {
	return NewV1RequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}
