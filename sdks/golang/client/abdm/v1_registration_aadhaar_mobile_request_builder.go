package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1RegistrationAadhaarMobileRequestBuilder builds and executes requests for operations under \golang\v1\registration\aadhaar\mobile
type V1RegistrationAadhaarMobileRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// NewV1RegistrationAadhaarMobileRequestBuilderInternal instantiates a new MobileRequestBuilder and sets the default values.
func NewV1RegistrationAadhaarMobileRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationAadhaarMobileRequestBuilder {
	m := &V1RegistrationAadhaarMobileRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/registration/aadhaar/mobile", pathParameters),
	}
	return m
}

// NewV1RegistrationAadhaarMobileRequestBuilder instantiates a new MobileRequestBuilder and sets the default values.
func NewV1RegistrationAadhaarMobileRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationAadhaarMobileRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1RegistrationAadhaarMobileRequestBuilderInternal(urlParams, requestAdapter)
}

// Resend the resend property
func (m *V1RegistrationAadhaarMobileRequestBuilder) Resend() *V1RegistrationAadhaarMobileResendRequestBuilder {
	return NewV1RegistrationAadhaarMobileResendRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Verify the verify property
func (m *V1RegistrationAadhaarMobileRequestBuilder) Verify() *V1RegistrationAadhaarMobileVerifyRequestBuilder {
	return NewV1RegistrationAadhaarMobileVerifyRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}
