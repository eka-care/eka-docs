package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1RequestBuilder builds and executes requests for operations under \golang\v1
type V1RequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// CareContexts the careContexts property
func (m *V1RequestBuilder) CareContexts() *V1CareContextsRequestBuilder {
	return NewV1CareContextsRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Consents the consents property
func (m *V1RequestBuilder) Consents() *V1ConsentsRequestBuilder {
	return NewV1ConsentsRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// NewV1RequestBuilderInternal instantiates a new V1RequestBuilder and sets the default values.
func NewV1RequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RequestBuilder {
	m := &V1RequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1", pathParameters),
	}
	return m
}

// NewV1RequestBuilder instantiates a new V1RequestBuilder and sets the default values.
func NewV1RequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1RequestBuilderInternal(urlParams, requestAdapter)
}

// Profile the profile property
func (m *V1RequestBuilder) Profile() *V1ProfileRequestBuilder {
	return NewV1ProfileRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Provider the provider property
func (m *V1RequestBuilder) Provider() *V1ProviderRequestBuilder {
	return NewV1ProviderRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Providers the providers property
func (m *V1RequestBuilder) Providers() *V1ProvidersRequestBuilder {
	return NewV1ProvidersRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Registration the registration property
func (m *V1RequestBuilder) Registration() *V1RegistrationRequestBuilder {
	return NewV1RegistrationRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Request the request property
func (m *V1RequestBuilder) Request() *V1RequestRequestBuilder {
	return NewV1RequestRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Requests the requests property
func (m *V1RequestBuilder) Requests() *V1RequestsRequestBuilder {
	return NewV1RequestsRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Session the session property
func (m *V1RequestBuilder) Session() *V1SessionRequestBuilder {
	return NewV1SessionRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}
