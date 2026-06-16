package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1CareContextsDiscoverLinkRequestBuilder builds and executes requests for operations under \golang\v1\care-contexts\discover\link
type V1CareContextsDiscoverLinkRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// Confirm the confirm property
func (m *V1CareContextsDiscoverLinkRequestBuilder) Confirm() *V1CareContextsDiscoverLinkConfirmRequestBuilder {
	return NewV1CareContextsDiscoverLinkConfirmRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// NewV1CareContextsDiscoverLinkRequestBuilderInternal instantiates a new LinkRequestBuilder and sets the default values.
func NewV1CareContextsDiscoverLinkRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1CareContextsDiscoverLinkRequestBuilder {
	m := &V1CareContextsDiscoverLinkRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/care-contexts/discover/link", pathParameters),
	}
	return m
}

// NewV1CareContextsDiscoverLinkRequestBuilder instantiates a new LinkRequestBuilder and sets the default values.
func NewV1CareContextsDiscoverLinkRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1CareContextsDiscoverLinkRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1CareContextsDiscoverLinkRequestBuilderInternal(urlParams, requestAdapter)
}

// Init the init property
func (m *V1CareContextsDiscoverLinkRequestBuilder) Init() *V1CareContextsDiscoverLinkInitRequestBuilder {
	return NewV1CareContextsDiscoverLinkInitRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}
