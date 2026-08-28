package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1ConsentsRequestBuilder builds and executes requests for operations under \golang\v1\consents
type V1ConsentsRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// Approve the approve property
func (m *V1ConsentsRequestBuilder) Approve() *V1ConsentsApproveRequestBuilder {
	return NewV1ConsentsApproveRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// NewV1ConsentsRequestBuilderInternal instantiates a new ConsentsRequestBuilder and sets the default values.
func NewV1ConsentsRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ConsentsRequestBuilder {
	m := &V1ConsentsRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/consents", pathParameters),
	}
	return m
}

// NewV1ConsentsRequestBuilder instantiates a new ConsentsRequestBuilder and sets the default values.
func NewV1ConsentsRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ConsentsRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1ConsentsRequestBuilderInternal(urlParams, requestAdapter)
}

// Deny the deny property
func (m *V1ConsentsRequestBuilder) Deny() *V1ConsentsDenyRequestBuilder {
	return NewV1ConsentsDenyRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Pin the pin property
func (m *V1ConsentsRequestBuilder) Pin() *V1ConsentsPinRequestBuilder {
	return NewV1ConsentsPinRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Revoke the revoke property
func (m *V1ConsentsRequestBuilder) Revoke() *V1ConsentsRevokeRequestBuilder {
	return NewV1ConsentsRevokeRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}
