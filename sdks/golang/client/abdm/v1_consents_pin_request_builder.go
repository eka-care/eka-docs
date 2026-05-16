package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1ConsentsPinRequestBuilder builds and executes requests for operations under \golang\v1\consents\pin
type V1ConsentsPinRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// Change the change property
func (m *V1ConsentsPinRequestBuilder) Change() *V1ConsentsPinChangeRequestBuilder {
	return NewV1ConsentsPinChangeRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// NewV1ConsentsPinRequestBuilderInternal instantiates a new PinRequestBuilder and sets the default values.
func NewV1ConsentsPinRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ConsentsPinRequestBuilder {
	m := &V1ConsentsPinRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/consents/pin", pathParameters),
	}
	return m
}

// NewV1ConsentsPinRequestBuilder instantiates a new PinRequestBuilder and sets the default values.
func NewV1ConsentsPinRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ConsentsPinRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1ConsentsPinRequestBuilderInternal(urlParams, requestAdapter)
}

// Exists the exists property
func (m *V1ConsentsPinRequestBuilder) Exists() *V1ConsentsPinExistsRequestBuilder {
	return NewV1ConsentsPinExistsRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Forgot the forgot property
func (m *V1ConsentsPinRequestBuilder) Forgot() *V1ConsentsPinForgotRequestBuilder {
	return NewV1ConsentsPinForgotRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Reset the reset property
func (m *V1ConsentsPinRequestBuilder) Reset() *V1ConsentsPinResetRequestBuilder {
	return NewV1ConsentsPinResetRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Set the set property
func (m *V1ConsentsPinRequestBuilder) Set() *V1ConsentsPinSetRequestBuilder {
	return NewV1ConsentsPinSetRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Verify the verify property
func (m *V1ConsentsPinRequestBuilder) Verify() *V1ConsentsPinVerifyRequestBuilder {
	return NewV1ConsentsPinVerifyRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}
