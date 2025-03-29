package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1SessionRequestBuilder builds and executes requests for operations under \golang\v1\session
type V1SessionRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// NewV1SessionRequestBuilderInternal instantiates a new SessionRequestBuilder and sets the default values.
func NewV1SessionRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1SessionRequestBuilder {
	m := &V1SessionRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/session", pathParameters),
	}
	return m
}

// NewV1SessionRequestBuilder instantiates a new SessionRequestBuilder and sets the default values.
func NewV1SessionRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1SessionRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1SessionRequestBuilderInternal(urlParams, requestAdapter)
}

// Init the init property
func (m *V1SessionRequestBuilder) Init() *V1SessionInitRequestBuilder {
	return NewV1SessionInitRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Verify the verify property
func (m *V1SessionRequestBuilder) Verify() *V1SessionVerifyRequestBuilder {
	return NewV1SessionVerifyRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}
