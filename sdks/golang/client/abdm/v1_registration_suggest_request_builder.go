package abdm

import (
	"context"
	i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7 "github.com/eka-care/eka-docs/sdks/golang/client/models"
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1RegistrationSuggestRequestBuilder builds and executes requests for operations under \golang\v1\registration\suggest
type V1RegistrationSuggestRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// V1RegistrationSuggestRequestBuilderPostRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type V1RegistrationSuggestRequestBuilderPostRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
}

// NewV1RegistrationSuggestRequestBuilderInternal instantiates a new SuggestRequestBuilder and sets the default values.
func NewV1RegistrationSuggestRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationSuggestRequestBuilder {
	m := &V1RegistrationSuggestRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/registration/suggest", pathParameters),
	}
	return m
}

// NewV1RegistrationSuggestRequestBuilder instantiates a new SuggestRequestBuilder and sets the default values.
func NewV1RegistrationSuggestRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RegistrationSuggestRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1RegistrationSuggestRequestBuilderInternal(urlParams, requestAdapter)
}

// Post this API endpoint is used to fetch some suggested abha id that are available on the basis of user details.
func (m *V1RegistrationSuggestRequestBuilder) Post(ctx context.Context, body i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.SuggestRequestable, requestConfiguration *V1RegistrationSuggestRequestBuilderPostRequestConfiguration) (i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.SuggestResponseable, error) {
	requestInfo, err := m.ToPostRequestInformation(ctx, body, requestConfiguration)
	if err != nil {
		return nil, err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
	}
	res, err := m.BaseRequestBuilder.RequestAdapter.Send(ctx, requestInfo, i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateSuggestResponseFromDiscriminatorValue, errorMapping)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, nil
	}
	return res.(i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.SuggestResponseable), nil
}

// ToPostRequestInformation this API endpoint is used to fetch some suggested abha id that are available on the basis of user details.
func (m *V1RegistrationSuggestRequestBuilder) ToPostRequestInformation(ctx context.Context, body i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.SuggestRequestable, requestConfiguration *V1RegistrationSuggestRequestBuilderPostRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
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
func (m *V1RegistrationSuggestRequestBuilder) WithUrl(rawUrl string) *V1RegistrationSuggestRequestBuilder {
	return NewV1RegistrationSuggestRequestBuilder(rawUrl, m.BaseRequestBuilder.RequestAdapter)
}
