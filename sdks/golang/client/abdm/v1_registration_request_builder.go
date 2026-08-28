package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1RegistrationRequestBuilder builds and executes requests for operations under \golang\v1\registration
type V1RegistrationRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// Aadhaar the aadhaar property
func (m *V1RegistrationRequestBuilder) Aadhaar() *V1RegistrationAadhaarRequestBuilder {
	return NewV1RegistrationAadhaarRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Abha the abha property
func (m *V1RegistrationRequestBuilder) Abha() *V1RegistrationAbhaRequestBuilder {
	return NewV1RegistrationAbhaRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// NewV1RegistrationRequestBuilderInternal instantiates a new RegistrationRequestBuilder and sets the default values.
func NewV1RegistrationRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationRequestBuilder {
	m := &V1RegistrationRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/registration", pathParameters),
	}
	return m
}

// NewV1RegistrationRequestBuilder instantiates a new RegistrationRequestBuilder and sets the default values.
func NewV1RegistrationRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1RegistrationRequestBuilderInternal(urlParams, requestAdapter)
}

// Mobile the mobile property
func (m *V1RegistrationRequestBuilder) Mobile() *V1RegistrationMobileRequestBuilder {
	return NewV1RegistrationMobileRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Pincode the pincode property
func (m *V1RegistrationRequestBuilder) Pincode() *V1RegistrationPincodeRequestBuilder {
	return NewV1RegistrationPincodeRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Suggest the suggest property
func (m *V1RegistrationRequestBuilder) Suggest() *V1RegistrationSuggestRequestBuilder {
	return NewV1RegistrationSuggestRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}
