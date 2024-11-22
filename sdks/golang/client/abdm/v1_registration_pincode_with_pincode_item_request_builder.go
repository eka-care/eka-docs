package abdm

import (
	"context"
	i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7 "github.com/eka-care/eka-docs/sdks/golang/client/models"
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1RegistrationPincodeWithPincodeItemRequestBuilder builds and executes requests for operations under \golang\v1\registration\pincode\{pincode}
type V1RegistrationPincodeWithPincodeItemRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// V1RegistrationPincodeWithPincodeItemRequestBuilderGetRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type V1RegistrationPincodeWithPincodeItemRequestBuilderGetRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
}

// NewV1RegistrationPincodeWithPincodeItemRequestBuilderInternal instantiates a new WithPincodeItemRequestBuilder and sets the default values.
func NewV1RegistrationPincodeWithPincodeItemRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationPincodeWithPincodeItemRequestBuilder {
	m := &V1RegistrationPincodeWithPincodeItemRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/registration/pincode/{pincode}", pathParameters),
	}
	return m
}

// NewV1RegistrationPincodeWithPincodeItemRequestBuilder instantiates a new WithPincodeItemRequestBuilder and sets the default values.
func NewV1RegistrationPincodeWithPincodeItemRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationPincodeWithPincodeItemRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1RegistrationPincodeWithPincodeItemRequestBuilderInternal(urlParams, requestAdapter)
}

// Get this API endpoint is used to fetch pincode details.
func (m *V1RegistrationPincodeWithPincodeItemRequestBuilder) Get(ctx context.Context, requestConfiguration *V1RegistrationPincodeWithPincodeItemRequestBuilderGetRequestConfiguration) (i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.PincodeResolvedPincodeDataable, error) {
	requestInfo, err := m.ToGetRequestInformation(ctx, requestConfiguration)
	if err != nil {
		return nil, err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
	}
	res, err := m.BaseRequestBuilder.RequestAdapter.Send(ctx, requestInfo, i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreatePincodeResolvedPincodeDataFromDiscriminatorValue, errorMapping)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, nil
	}
	return res.(i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.PincodeResolvedPincodeDataable), nil
}

// ToGetRequestInformation this API endpoint is used to fetch pincode details.
func (m *V1RegistrationPincodeWithPincodeItemRequestBuilder) ToGetRequestInformation(ctx context.Context, requestConfiguration *V1RegistrationPincodeWithPincodeItemRequestBuilderGetRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
	requestInfo := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewRequestInformationWithMethodAndUrlTemplateAndPathParameters(i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.GET, m.BaseRequestBuilder.UrlTemplate, m.BaseRequestBuilder.PathParameters)
	if requestConfiguration != nil {
		requestInfo.Headers.AddAll(requestConfiguration.Headers)
		requestInfo.AddRequestOptions(requestConfiguration.Options)
	}
	requestInfo.Headers.TryAdd("Accept", "application/json")
	return requestInfo, nil
}

// WithUrl returns a request builder with the provided arbitrary URL. Using this method means any other path or query parameters are ignored.
func (m *V1RegistrationPincodeWithPincodeItemRequestBuilder) WithUrl(rawUrl string) *V1RegistrationPincodeWithPincodeItemRequestBuilder {
	return NewV1RegistrationPincodeWithPincodeItemRequestBuilder(rawUrl, m.BaseRequestBuilder.RequestAdapter)
}
