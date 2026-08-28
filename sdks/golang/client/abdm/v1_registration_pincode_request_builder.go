package abdm

import (
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1RegistrationPincodeRequestBuilder builds and executes requests for operations under \golang\v1\registration\pincode
type V1RegistrationPincodeRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// ByPincode gets an item from the abdm_client/client.golang.v1.registration.pincode.item collection
func (m *V1RegistrationPincodeRequestBuilder) ByPincode(pincode string) *V1RegistrationPincodeWithPincodeItemRequestBuilder {
	urlTplParams := make(map[string]string)
	for idx, item := range m.BaseRequestBuilder.PathParameters {
		urlTplParams[idx] = item
	}
	if pincode != "" {
		urlTplParams["pincode"] = pincode
	}
	return NewV1RegistrationPincodeWithPincodeItemRequestBuilderInternal(urlTplParams, m.BaseRequestBuilder.RequestAdapter)
}

// NewV1RegistrationPincodeRequestBuilderInternal instantiates a new PincodeRequestBuilder and sets the default values.
func NewV1RegistrationPincodeRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationPincodeRequestBuilder {
	m := &V1RegistrationPincodeRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/registration/pincode", pathParameters),
	}
	return m
}

// NewV1RegistrationPincodeRequestBuilder instantiates a new PincodeRequestBuilder and sets the default values.
func NewV1RegistrationPincodeRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationPincodeRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1RegistrationPincodeRequestBuilderInternal(urlParams, requestAdapter)
}
