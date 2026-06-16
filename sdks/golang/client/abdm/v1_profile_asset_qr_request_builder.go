package abdm

import (
	"context"
	ie5ff1c2b748baa95e4161bd550d79136906382a1753d379c3989e0eef11dfc30 "github.com/eka-care/eka-docs/sdks/golang/client/abdm/v1/profile/asset/qr"
	i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7 "github.com/eka-care/eka-docs/sdks/golang/client/models"
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1ProfileAssetQrRequestBuilder builds and executes requests for operations under \golang\v1\profile\asset\qr
type V1ProfileAssetQrRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// V1ProfileAssetQrRequestBuilderGetQueryParameters fetch the data for ABHA qr code display. <Note>Please cache these results locally. We do not recommend calling this API on every page load. Evict the cache when there is profile update.</Note><Warning>There is no fixed structure for this JSON; it can vary depending on the creation of ABHA. Generate the QR code based on the content of the response body.</Warning>
type V1ProfileAssetQrRequestBuilderGetQueryParameters struct {
	//
	// Deprecated: This property is deprecated, use formatAsGetFormatQueryParameterType instead
	Format *string `uriparametername:"format"`
	//
	FormatAsGetFormatQueryParameterType *ie5ff1c2b748baa95e4161bd550d79136906382a1753d379c3989e0eef11dfc30.GetFormatQueryParameterType `uriparametername:"format"`
}

// V1ProfileAssetQrRequestBuilderGetRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type V1ProfileAssetQrRequestBuilderGetRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
	// Request query parameters
	QueryParameters *V1ProfileAssetQrRequestBuilderGetQueryParameters
}

// NewV1ProfileAssetQrRequestBuilderInternal instantiates a new QrRequestBuilder and sets the default values.
func NewV1ProfileAssetQrRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ProfileAssetQrRequestBuilder {
	m := &V1ProfileAssetQrRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/profile/asset/qr{?format*}", pathParameters),
	}
	return m
}

// NewV1ProfileAssetQrRequestBuilder instantiates a new QrRequestBuilder and sets the default values.
func NewV1ProfileAssetQrRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ProfileAssetQrRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1ProfileAssetQrRequestBuilderInternal(urlParams, requestAdapter)
}

// Get fetch the data for ABHA qr code display. <Note>Please cache these results locally. We do not recommend calling this API on every page load. Evict the cache when there is profile update.</Note><Warning>There is no fixed structure for this JSON; it can vary depending on the creation of ABHA. Generate the QR code based on the content of the response body.</Warning>
// Deprecated: This method is obsolete. Use GetAsQrGetResponse instead.
func (m *V1ProfileAssetQrRequestBuilder) Get(ctx context.Context, requestConfiguration *V1ProfileAssetQrRequestBuilderGetRequestConfiguration) (V1ProfileAssetQrResponseable, error) {
	requestInfo, err := m.ToGetRequestInformation(ctx, requestConfiguration)
	if err != nil {
		return nil, err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
	}
	res, err := m.BaseRequestBuilder.RequestAdapter.Send(ctx, requestInfo, CreateV1ProfileAssetQrResponseFromDiscriminatorValue, errorMapping)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, nil
	}
	return res.(V1ProfileAssetQrResponseable), nil
}

// GetAsQrGetResponse fetch the data for ABHA qr code display. <Note>Please cache these results locally. We do not recommend calling this API on every page load. Evict the cache when there is profile update.</Note><Warning>There is no fixed structure for this JSON; it can vary depending on the creation of ABHA. Generate the QR code based on the content of the response body.</Warning>
func (m *V1ProfileAssetQrRequestBuilder) GetAsQrGetResponse(ctx context.Context, requestConfiguration *V1ProfileAssetQrRequestBuilderGetRequestConfiguration) (V1ProfileAssetQrGetResponseable, error) {
	requestInfo, err := m.ToGetRequestInformation(ctx, requestConfiguration)
	if err != nil {
		return nil, err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
	}
	res, err := m.BaseRequestBuilder.RequestAdapter.Send(ctx, requestInfo, CreateV1ProfileAssetQrGetResponseFromDiscriminatorValue, errorMapping)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, nil
	}
	return res.(V1ProfileAssetQrGetResponseable), nil
}

// ToGetRequestInformation fetch the data for ABHA qr code display. <Note>Please cache these results locally. We do not recommend calling this API on every page load. Evict the cache when there is profile update.</Note><Warning>There is no fixed structure for this JSON; it can vary depending on the creation of ABHA. Generate the QR code based on the content of the response body.</Warning>
func (m *V1ProfileAssetQrRequestBuilder) ToGetRequestInformation(ctx context.Context, requestConfiguration *V1ProfileAssetQrRequestBuilderGetRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
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
func (m *V1ProfileAssetQrRequestBuilder) WithUrl(rawUrl string) *V1ProfileAssetQrRequestBuilder {
	return NewV1ProfileAssetQrRequestBuilder(rawUrl, m.BaseRequestBuilder.RequestAdapter)
}
