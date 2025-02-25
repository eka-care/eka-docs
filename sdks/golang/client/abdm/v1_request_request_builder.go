package abdm

import (
	"context"
	i837dc8c5882097efdb6929b74f4c8da74318387ee2599a8a0ee4eeb754ff75c1 "github.com/eka-care/eka-docs/sdks/golang/client/abdm/v1/request"
	i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7 "github.com/eka-care/eka-docs/sdks/golang/client/models"
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1RequestRequestBuilder builds and executes requests for operations under \golang\v1\request
type V1RequestRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// V1RequestRequestBuilderGetQueryParameters
type V1RequestRequestBuilderGetQueryParameters struct {
	// Consent/Subscription/Authorization ID
	Id *string `uriparametername:"id"`
	// Status of the request
	// Deprecated: This property is deprecated, use statusAsGetStatusQueryParameterType instead
	Status *string `uriparametername:"status"`
	// Status of the request
	StatusAsGetStatusQueryParameterType *i837dc8c5882097efdb6929b74f4c8da74318387ee2599a8a0ee4eeb754ff75c1.GetStatusQueryParameterType `uriparametername:"status"`
	// Request type
	// Deprecated: This property is deprecated, use typeAsGetTypeQueryParameterType instead
	Type *string `uriparametername:"type"`
	// Request type
	TypeAsGetTypeQueryParameterType *i837dc8c5882097efdb6929b74f4c8da74318387ee2599a8a0ee4eeb754ff75c1.GetTypeQueryParameterType `uriparametername:"type"`
}

// V1RequestRequestBuilderGetRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type V1RequestRequestBuilderGetRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
	// Request query parameters
	QueryParameters *V1RequestRequestBuilderGetQueryParameters
}

// NewV1RequestRequestBuilderInternal instantiates a new RequestRequestBuilder and sets the default values.
func NewV1RequestRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RequestRequestBuilder {
	m := &V1RequestRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/request{?id*,status*,type*}", pathParameters),
	}
	return m
}

// NewV1RequestRequestBuilder instantiates a new RequestRequestBuilder and sets the default values.
func NewV1RequestRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RequestRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1RequestRequestBuilderInternal(urlParams, requestAdapter)
}
func (m *V1RequestRequestBuilder) Get(ctx context.Context, requestConfiguration *V1RequestRequestBuilderGetRequestConfiguration) (i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.DetailsResponseable, error) {
	requestInfo, err := m.ToGetRequestInformation(ctx, requestConfiguration)
	if err != nil {
		return nil, err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
	}
	res, err := m.BaseRequestBuilder.RequestAdapter.Send(ctx, requestInfo, i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateDetailsResponseFromDiscriminatorValue, errorMapping)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, nil
	}
	return res.(i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.DetailsResponseable), nil
}
func (m *V1RequestRequestBuilder) ToGetRequestInformation(ctx context.Context, requestConfiguration *V1RequestRequestBuilderGetRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
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
func (m *V1RequestRequestBuilder) WithUrl(rawUrl string) *V1RequestRequestBuilder {
	return NewV1RequestRequestBuilder(rawUrl, m.BaseRequestBuilder.RequestAdapter)
}
