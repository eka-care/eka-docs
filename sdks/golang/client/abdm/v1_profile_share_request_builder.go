package abdm

import (
	"context"
	i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7 "github.com/eka-care/eka-docs/sdks/golang/client/models"
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1ProfileShareRequestBuilder builds and executes requests for operations under \golang\v1\profile\share
type V1ProfileShareRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// V1ProfileShareRequestBuilderPostRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type V1ProfileShareRequestBuilderPostRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
}

// NewV1ProfileShareRequestBuilderInternal instantiates a new ShareRequestBuilder and sets the default values.
func NewV1ProfileShareRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ProfileShareRequestBuilder {
	m := &V1ProfileShareRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/profile/share", pathParameters),
	}
	return m
}

// NewV1ProfileShareRequestBuilder instantiates a new ShareRequestBuilder and sets the default values.
func NewV1ProfileShareRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ProfileShareRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1ProfileShareRequestBuilderInternal(urlParams, requestAdapter)
}

// Post fetch the token from a hospital. <Note> Get the hip_id and counter_id by reading the QR code of the Hospital/Clinic.</Note> <Note>Use the device location for the location data</Note>
func (m *V1ProfileShareRequestBuilder) Post(ctx context.Context, body i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.ScanandshareRequestable, requestConfiguration *V1ProfileShareRequestBuilderPostRequestConfiguration) (i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.HipQRScanShareProfileResponseV2able, error) {
	requestInfo, err := m.ToPostRequestInformation(ctx, body, requestConfiguration)
	if err != nil {
		return nil, err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
	}
	res, err := m.BaseRequestBuilder.RequestAdapter.Send(ctx, requestInfo, i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateHipQRScanShareProfileResponseV2FromDiscriminatorValue, errorMapping)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, nil
	}
	return res.(i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.HipQRScanShareProfileResponseV2able), nil
}

// ToPostRequestInformation fetch the token from a hospital. <Note> Get the hip_id and counter_id by reading the QR code of the Hospital/Clinic.</Note> <Note>Use the device location for the location data</Note>
func (m *V1ProfileShareRequestBuilder) ToPostRequestInformation(ctx context.Context, body i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.ScanandshareRequestable, requestConfiguration *V1ProfileShareRequestBuilderPostRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
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
func (m *V1ProfileShareRequestBuilder) WithUrl(rawUrl string) *V1ProfileShareRequestBuilder {
	return NewV1ProfileShareRequestBuilder(rawUrl, m.BaseRequestBuilder.RequestAdapter)
}
