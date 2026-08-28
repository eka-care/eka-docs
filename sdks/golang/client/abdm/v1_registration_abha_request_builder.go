package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1RegistrationAbhaRequestBuilder builds and executes requests for operations under \golang\v1\registration\abha
type V1RegistrationAbhaRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// Check the check property
func (m *V1RegistrationAbhaRequestBuilder) Check() *V1RegistrationAbhaCheckRequestBuilder {
	return NewV1RegistrationAbhaCheckRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// NewV1RegistrationAbhaRequestBuilderInternal instantiates a new AbhaRequestBuilder and sets the default values.
func NewV1RegistrationAbhaRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationAbhaRequestBuilder {
	m := &V1RegistrationAbhaRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/registration/abha", pathParameters),
	}
	return m
}

// NewV1RegistrationAbhaRequestBuilder instantiates a new AbhaRequestBuilder and sets the default values.
func NewV1RegistrationAbhaRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationAbhaRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1RegistrationAbhaRequestBuilderInternal(urlParams, requestAdapter)
}
