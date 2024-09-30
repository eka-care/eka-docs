package abdm

import (
	"context"
	i0cedb531106a2595849725e5d059596e1b6f3f0619fb4ef9cc14b082389fba41 "github.com/eka-care/eka-docs/sdks/golang/client/abdm/v1/requests"
	i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7 "github.com/eka-care/eka-docs/sdks/golang/client/models"
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1RequestsRequestBuilder builds and executes requests for operations under \golang\v1\requests
type V1RequestsRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// V1RequestsRequestBuilderGetQueryParameters aPI to list all the Subscriptions / Authorization and Consent requests
type V1RequestsRequestBuilderGetQueryParameters struct {
	//
	// Deprecated: This property is deprecated, use statusAsGetStatusQueryParameterType instead
	Status *string `uriparametername:"status"`
	//
	StatusAsGetStatusQueryParameterType *i0cedb531106a2595849725e5d059596e1b6f3f0619fb4ef9cc14b082389fba41.GetStatusQueryParameterType `uriparametername:"status"`
	//
	// Deprecated: This property is deprecated, use typeAsGetTypeQueryParameterType instead
	Type *string `uriparametername:"type"`
	//
	TypeAsGetTypeQueryParameterType *i0cedb531106a2595849725e5d059596e1b6f3f0619fb4ef9cc14b082389fba41.GetTypeQueryParameterType `uriparametername:"type"`
}

// V1RequestsRequestBuilderGetRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type V1RequestsRequestBuilderGetRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
	// Request query parameters
	QueryParameters *V1RequestsRequestBuilderGetQueryParameters
}

// NewV1RequestsRequestBuilderInternal instantiates a new RequestsRequestBuilder and sets the default values.
func NewV1RequestsRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RequestsRequestBuilder {
	m := &V1RequestsRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/requests{?status*,type*}", pathParameters),
	}
	return m
}

// NewV1RequestsRequestBuilder instantiates a new RequestsRequestBuilder and sets the default values.
func NewV1RequestsRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1RequestsRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1RequestsRequestBuilderInternal(urlParams, requestAdapter)
}

// Get aPI to list all the Subscriptions / Authorization and Consent requests
func (m *V1RequestsRequestBuilder) Get(ctx context.Context, requestConfiguration *V1RequestsRequestBuilderGetRequestConfiguration) (i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.ListsResponseable, error) {
	requestInfo, err := m.ToGetRequestInformation(ctx, requestConfiguration)
	if err != nil {
		return nil, err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
	}
	res, err := m.BaseRequestBuilder.RequestAdapter.Send(ctx, requestInfo, i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateListsResponseFromDiscriminatorValue, errorMapping)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, nil
	}
	return res.(i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.ListsResponseable), nil
}

// ToGetRequestInformation aPI to list all the Subscriptions / Authorization and Consent requests
func (m *V1RequestsRequestBuilder) ToGetRequestInformation(ctx context.Context, requestConfiguration *V1RequestsRequestBuilderGetRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
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
func (m *V1RequestsRequestBuilder) WithUrl(rawUrl string) *V1RequestsRequestBuilder {
	return NewV1RequestsRequestBuilder(rawUrl, m.BaseRequestBuilder.RequestAdapter)
}
