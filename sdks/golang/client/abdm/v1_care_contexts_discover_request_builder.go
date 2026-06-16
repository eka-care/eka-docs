package abdm

import (
	"context"
	i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7 "github.com/eka-care/eka-docs/sdks/golang/client/models"
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1CareContextsDiscoverRequestBuilder builds and executes requests for operations under \golang\v1\care-contexts\discover
type V1CareContextsDiscoverRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// V1CareContextsDiscoverRequestBuilderPostRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type V1CareContextsDiscoverRequestBuilderPostRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
}

// NewV1CareContextsDiscoverRequestBuilderInternal instantiates a new DiscoverRequestBuilder and sets the default values.
func NewV1CareContextsDiscoverRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1CareContextsDiscoverRequestBuilder {
	m := &V1CareContextsDiscoverRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/care-contexts/discover", pathParameters),
	}
	return m
}

// NewV1CareContextsDiscoverRequestBuilder instantiates a new DiscoverRequestBuilder and sets the default values.
func NewV1CareContextsDiscoverRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1CareContextsDiscoverRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1CareContextsDiscoverRequestBuilderInternal(urlParams, requestAdapter)
}

// Link the link property
func (m *V1CareContextsDiscoverRequestBuilder) Link() *V1CareContextsDiscoverLinkRequestBuilder {
	return NewV1CareContextsDiscoverLinkRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// Post aBDM allows a user to find their health records from any health facility they have visited via the discovery process. Discover API returns any unlinked care-context for the ABHA User.
func (m *V1CareContextsDiscoverRequestBuilder) Post(ctx context.Context, body i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.DiscoverRequestable, requestConfiguration *V1CareContextsDiscoverRequestBuilderPostRequestConfiguration) (i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.DiscoverResponseable, error) {
	requestInfo, err := m.ToPostRequestInformation(ctx, body, requestConfiguration)
	if err != nil {
		return nil, err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGerrorErrorRespFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGerrorErrorRespFromDiscriminatorValue,
	}
	res, err := m.BaseRequestBuilder.RequestAdapter.Send(ctx, requestInfo, i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateDiscoverResponseFromDiscriminatorValue, errorMapping)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, nil
	}
	return res.(i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.DiscoverResponseable), nil
}

// ToPostRequestInformation aBDM allows a user to find their health records from any health facility they have visited via the discovery process. Discover API returns any unlinked care-context for the ABHA User.
func (m *V1CareContextsDiscoverRequestBuilder) ToPostRequestInformation(ctx context.Context, body i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.DiscoverRequestable, requestConfiguration *V1CareContextsDiscoverRequestBuilderPostRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
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
func (m *V1CareContextsDiscoverRequestBuilder) WithUrl(rawUrl string) *V1CareContextsDiscoverRequestBuilder {
	return NewV1CareContextsDiscoverRequestBuilder(rawUrl, m.BaseRequestBuilder.RequestAdapter)
}
