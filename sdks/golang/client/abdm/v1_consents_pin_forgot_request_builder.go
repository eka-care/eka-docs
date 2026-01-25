package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1ConsentsPinForgotRequestBuilder builds and executes requests for operations under \golang\v1\consents\pin\forgot
type V1ConsentsPinForgotRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// NewV1ConsentsPinForgotRequestBuilderInternal instantiates a new ForgotRequestBuilder and sets the default values.
func NewV1ConsentsPinForgotRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ConsentsPinForgotRequestBuilder {
	m := &V1ConsentsPinForgotRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/consents/pin/forgot", pathParameters),
	}
	return m
}

// NewV1ConsentsPinForgotRequestBuilder instantiates a new ForgotRequestBuilder and sets the default values.
func NewV1ConsentsPinForgotRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ConsentsPinForgotRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1ConsentsPinForgotRequestBuilderInternal(urlParams, requestAdapter)
}

// Init the init property
func (m *V1ConsentsPinForgotRequestBuilder) Init() *V1ConsentsPinForgotInitRequestBuilder {
	return NewV1ConsentsPinForgotInitRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Verify the verify property
func (m *V1ConsentsPinForgotRequestBuilder) Verify() *V1ConsentsPinForgotVerifyRequestBuilder {
	return NewV1ConsentsPinForgotVerifyRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}
