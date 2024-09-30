package abdm

import (
	"context"
	i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7 "github.com/eka-care/eka-docs/sdks/golang/client/models"
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1CareContextsDiscoverLinkConfirmRequestBuilder builds and executes requests for operations under \golang\v1\care-contexts\discover\link\confirm
type V1CareContextsDiscoverLinkConfirmRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// V1CareContextsDiscoverLinkConfirmRequestBuilderPostRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type V1CareContextsDiscoverLinkConfirmRequestBuilderPostRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
}

// NewV1CareContextsDiscoverLinkConfirmRequestBuilderInternal instantiates a new ConfirmRequestBuilder and sets the default values.
func NewV1CareContextsDiscoverLinkConfirmRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1CareContextsDiscoverLinkConfirmRequestBuilder {
	m := &V1CareContextsDiscoverLinkConfirmRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/care-contexts/discover/link/confirm", pathParameters),
	}
	return m
}

// NewV1CareContextsDiscoverLinkConfirmRequestBuilder instantiates a new ConfirmRequestBuilder and sets the default values.
func NewV1CareContextsDiscoverLinkConfirmRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1CareContextsDiscoverLinkConfirmRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1CareContextsDiscoverLinkConfirmRequestBuilderInternal(urlParams, requestAdapter)
}

// Post confirm linking for discovered care context
func (m *V1CareContextsDiscoverLinkConfirmRequestBuilder) Post(ctx context.Context, body i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.ConfirmRequestable, requestConfiguration *V1CareContextsDiscoverLinkConfirmRequestBuilderPostRequestConfiguration) (i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.ConfirmResponseable, error) {
	requestInfo, err := m.ToPostRequestInformation(ctx, body, requestConfiguration)
	if err != nil {
		return nil, err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGerrorErrorRespFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGerrorErrorRespFromDiscriminatorValue,
	}
	res, err := m.BaseRequestBuilder.RequestAdapter.Send(ctx, requestInfo, i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateConfirmResponseFromDiscriminatorValue, errorMapping)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, nil
	}
	return res.(i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.ConfirmResponseable), nil
}

// ToPostRequestInformation confirm linking for discovered care context
func (m *V1CareContextsDiscoverLinkConfirmRequestBuilder) ToPostRequestInformation(ctx context.Context, body i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.ConfirmRequestable, requestConfiguration *V1CareContextsDiscoverLinkConfirmRequestBuilderPostRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
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
func (m *V1CareContextsDiscoverLinkConfirmRequestBuilder) WithUrl(rawUrl string) *V1CareContextsDiscoverLinkConfirmRequestBuilder {
	return NewV1CareContextsDiscoverLinkConfirmRequestBuilder(rawUrl, m.BaseRequestBuilder.RequestAdapter)
}
