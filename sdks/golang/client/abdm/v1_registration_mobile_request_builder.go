package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1RegistrationMobileRequestBuilder builds and executes requests for operations under \golang\v1\registration\mobile
type V1RegistrationMobileRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// NewV1RegistrationMobileRequestBuilderInternal instantiates a new MobileRequestBuilder and sets the default values.
func NewV1RegistrationMobileRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationMobileRequestBuilder {
	m := &V1RegistrationMobileRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/registration/mobile", pathParameters),
	}
	return m
}

// NewV1RegistrationMobileRequestBuilder instantiates a new MobileRequestBuilder and sets the default values.
func NewV1RegistrationMobileRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationMobileRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1RegistrationMobileRequestBuilderInternal(urlParams, requestAdapter)
}

// Create the create property
func (m *V1RegistrationMobileRequestBuilder) Create() *V1RegistrationMobileCreateRequestBuilder {
	return NewV1RegistrationMobileCreateRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Init the init property
func (m *V1RegistrationMobileRequestBuilder) Init() *V1RegistrationMobileInitRequestBuilder {
	return NewV1RegistrationMobileInitRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Login the login property
func (m *V1RegistrationMobileRequestBuilder) Login() *V1RegistrationMobileLoginRequestBuilder {
	return NewV1RegistrationMobileLoginRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Resend the resend property
func (m *V1RegistrationMobileRequestBuilder) Resend() *V1RegistrationMobileResendRequestBuilder {
	return NewV1RegistrationMobileResendRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Verify the verify property
func (m *V1RegistrationMobileRequestBuilder) Verify() *V1RegistrationMobileVerifyRequestBuilder {
	return NewV1RegistrationMobileVerifyRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}
