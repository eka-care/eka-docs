package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1RegistrationAadhaarRequestBuilder builds and executes requests for operations under \golang\v1\registration\aadhaar
type V1RegistrationAadhaarRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// NewV1RegistrationAadhaarRequestBuilderInternal instantiates a new AadhaarRequestBuilder and sets the default values.
func NewV1RegistrationAadhaarRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationAadhaarRequestBuilder {
	m := &V1RegistrationAadhaarRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/registration/aadhaar", pathParameters),
	}
	return m
}

// NewV1RegistrationAadhaarRequestBuilder instantiates a new AadhaarRequestBuilder and sets the default values.
func NewV1RegistrationAadhaarRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationAadhaarRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1RegistrationAadhaarRequestBuilderInternal(urlParams, requestAdapter)
}

// Create the create property
func (m *V1RegistrationAadhaarRequestBuilder) Create() *V1RegistrationAadhaarCreateRequestBuilder {
	return NewV1RegistrationAadhaarCreateRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Init the init property
func (m *V1RegistrationAadhaarRequestBuilder) Init() *V1RegistrationAadhaarInitRequestBuilder {
	return NewV1RegistrationAadhaarInitRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Mobile the mobile property
func (m *V1RegistrationAadhaarRequestBuilder) Mobile() *V1RegistrationAadhaarMobileRequestBuilder {
	return NewV1RegistrationAadhaarMobileRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Resend the resend property
func (m *V1RegistrationAadhaarRequestBuilder) Resend() *V1RegistrationAadhaarResendRequestBuilder {
	return NewV1RegistrationAadhaarResendRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Verify the verify property
func (m *V1RegistrationAadhaarRequestBuilder) Verify() *V1RegistrationAadhaarVerifyRequestBuilder {
	return NewV1RegistrationAadhaarVerifyRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}
