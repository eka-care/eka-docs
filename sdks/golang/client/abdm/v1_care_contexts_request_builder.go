package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1CareContextsRequestBuilder builds and executes requests for operations under \golang\v1\care-contexts
type V1CareContextsRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// NewV1CareContextsRequestBuilderInternal instantiates a new CareContextsRequestBuilder and sets the default values.
func NewV1CareContextsRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1CareContextsRequestBuilder {
	m := &V1CareContextsRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/care-contexts", pathParameters),
	}
	return m
}

// NewV1CareContextsRequestBuilder instantiates a new CareContextsRequestBuilder and sets the default values.
func NewV1CareContextsRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1CareContextsRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1CareContextsRequestBuilderInternal(urlParams, requestAdapter)
}

// Discover the discover property
func (m *V1CareContextsRequestBuilder) Discover() *V1CareContextsDiscoverRequestBuilder {
	return NewV1CareContextsDiscoverRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Linked the linked property
func (m *V1CareContextsRequestBuilder) Linked() *V1CareContextsLinkedRequestBuilder {
	return NewV1CareContextsLinkedRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Providers the providers property
func (m *V1CareContextsRequestBuilder) Providers() *V1CareContextsProvidersRequestBuilder {
	return NewV1CareContextsProvidersRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}
