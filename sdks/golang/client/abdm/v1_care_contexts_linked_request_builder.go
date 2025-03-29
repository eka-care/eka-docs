package abdm

import (
	"context"
	i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7 "github.com/eka-care/eka-docs/sdks/golang/client/models"
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1CareContextsLinkedRequestBuilder builds and executes requests for operations under \golang\v1\care-contexts\linked
type V1CareContextsLinkedRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// V1CareContextsLinkedRequestBuilderGetQueryParameters
type V1CareContextsLinkedRequestBuilderGetQueryParameters struct {
	//
	Hip_id *string `uriparametername:"hip_id"`
}

// V1CareContextsLinkedRequestBuilderGetRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type V1CareContextsLinkedRequestBuilderGetRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
	// Request query parameters
	QueryParameters *V1CareContextsLinkedRequestBuilderGetQueryParameters
}

// NewV1CareContextsLinkedRequestBuilderInternal instantiates a new LinkedRequestBuilder and sets the default values.
func NewV1CareContextsLinkedRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1CareContextsLinkedRequestBuilder {
	m := &V1CareContextsLinkedRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/care-contexts/linked?hip_id={hip_id}", pathParameters),
	}
	return m
}

// NewV1CareContextsLinkedRequestBuilder instantiates a new LinkedRequestBuilder and sets the default values.
func NewV1CareContextsLinkedRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1CareContextsLinkedRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1CareContextsLinkedRequestBuilderInternal(urlParams, requestAdapter)
}
func (m *V1CareContextsLinkedRequestBuilder) Get(ctx context.Context, requestConfiguration *V1CareContextsLinkedRequestBuilderGetRequestConfiguration) (i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.RecordsResponseable, error) {
	requestInfo, err := m.ToGetRequestInformation(ctx, requestConfiguration)
	if err != nil {
		return nil, err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
	}
	res, err := m.BaseRequestBuilder.RequestAdapter.Send(ctx, requestInfo, i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateRecordsResponseFromDiscriminatorValue, errorMapping)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, nil
	}
	return res.(i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.RecordsResponseable), nil
}
func (m *V1CareContextsLinkedRequestBuilder) ToGetRequestInformation(ctx context.Context, requestConfiguration *V1CareContextsLinkedRequestBuilderGetRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
	requestInfo := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewRequestInformationWithMethodAndUrlTemplateAndPathParameters(i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.GET, m.BaseRequestBuilder.UrlTemplate, m.BaseRequestBuilder.PathParameters)
	if requestConfiguration != nil {
		if requestConfiguration.QueryParameters != nil {
			requestInfo.AddQueryParameters(*(requestConfiguration.QueryParameters))
		}
		requestInfo.Headers.AddAll(requestConfiguration.Headers)
		requestInfo.AddRequestOptions(requestConfiguration.Options)
	}
	requestInfo.Headers.TryAdd("Accept", "application/json")
	return requestInfo, nil
}

// WithUrl returns a request builder with the provided arbitrary URL. Using this method means any other path or query parameters are ignored.
func (m *V1CareContextsLinkedRequestBuilder) WithUrl(rawUrl string) *V1CareContextsLinkedRequestBuilder {
	return NewV1CareContextsLinkedRequestBuilder(rawUrl, m.BaseRequestBuilder.RequestAdapter)
}
