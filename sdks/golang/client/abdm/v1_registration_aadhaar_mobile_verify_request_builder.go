package abdm

import (
	"context"
	i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7 "github.com/eka-care/eka-docs/sdks/golang/client/models"
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1RegistrationAadhaarMobileVerifyRequestBuilder builds and executes requests for operations under \golang\v1\registration\aadhaar\mobile\verify
type V1RegistrationAadhaarMobileVerifyRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// V1RegistrationAadhaarMobileVerifyRequestBuilderPostRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type V1RegistrationAadhaarMobileVerifyRequestBuilderPostRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
}

// NewV1RegistrationAadhaarMobileVerifyRequestBuilderInternal instantiates a new VerifyRequestBuilder and sets the default values.
func NewV1RegistrationAadhaarMobileVerifyRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationAadhaarMobileVerifyRequestBuilder {
	m := &V1RegistrationAadhaarMobileVerifyRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/registration/aadhaar/mobile/verify", pathParameters),
	}
	return m
}

// NewV1RegistrationAadhaarMobileVerifyRequestBuilder instantiates a new VerifyRequestBuilder and sets the default values.
func NewV1RegistrationAadhaarMobileVerifyRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationAadhaarMobileVerifyRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1RegistrationAadhaarMobileVerifyRequestBuilderInternal(urlParams, requestAdapter)
}

// Post this API operates on a skip logic basis. If the mobile number provided in the second step differs from the one linked to the Aadhaar, this API will be used to verify the new mobile number.
func (m *V1RegistrationAadhaarMobileVerifyRequestBuilder) Post(ctx context.Context, body i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.VerifyRequestType2able, requestConfiguration *V1RegistrationAadhaarMobileVerifyRequestBuilderPostRequestConfiguration) (i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.VerifyResponseType2able, error) {
	requestInfo, err := m.ToPostRequestInformation(ctx, body, requestConfiguration)
	if err != nil {
		return nil, err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
	}
	res, err := m.BaseRequestBuilder.RequestAdapter.Send(ctx, requestInfo, i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateVerifyResponseType2FromDiscriminatorValue, errorMapping)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, nil
	}
	return res.(i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.VerifyResponseType2able), nil
}

// ToPostRequestInformation this API operates on a skip logic basis. If the mobile number provided in the second step differs from the one linked to the Aadhaar, this API will be used to verify the new mobile number.
func (m *V1RegistrationAadhaarMobileVerifyRequestBuilder) ToPostRequestInformation(ctx context.Context, body i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.VerifyRequestType2able, requestConfiguration *V1RegistrationAadhaarMobileVerifyRequestBuilderPostRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
	requestInfo := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewRequestInformationWithMethodAndUrlTemplateAndPathParameters(i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.POST, m.BaseRequestBuilder.UrlTemplate, m.BaseRequestBuilder.PathParameters)
	if requestConfiguration != nil {
		requestInfo.Headers.AddAll(requestConfiguration.Headers)
		requestInfo.AddRequestOptions(requestConfiguration.Options)
	}
	requestInfo.Headers.TryAdd("Accept", "application/json")
	err := requestInfo.SetContentFromParsable(ctx, m.BaseRequestBuilder.RequestAdapter, "application/json", body)
	if err != nil {
		return nil, err
	}
	return requestInfo, nil
}

// WithUrl returns a request builder with the provided arbitrary URL. Using this method means any other path or query parameters are ignored.
func (m *V1RegistrationAadhaarMobileVerifyRequestBuilder) WithUrl(rawUrl string) *V1RegistrationAadhaarMobileVerifyRequestBuilder {
	return NewV1RegistrationAadhaarMobileVerifyRequestBuilder(rawUrl, m.BaseRequestBuilder.RequestAdapter)
}
