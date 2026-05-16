package abdm

import (
	"context"
	i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7 "github.com/eka-care/eka-docs/sdks/golang/client/models"
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// V1ProfileRequestBuilder builds and executes requests for operations under \golang\v1\profile
type V1ProfileRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// V1ProfileRequestBuilderDeleteRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type V1ProfileRequestBuilderDeleteRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
}

// V1ProfileRequestBuilderGetRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type V1ProfileRequestBuilderGetRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
}

// V1ProfileRequestBuilderPatchRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type V1ProfileRequestBuilderPatchRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
}

// Asset the asset property
func (m *V1ProfileRequestBuilder) Asset() *V1ProfileAssetRequestBuilder {
	return NewV1ProfileAssetRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// NewV1ProfileRequestBuilderInternal instantiates a new ProfileRequestBuilder and sets the default values.
func NewV1ProfileRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ProfileRequestBuilder {
	m := &V1ProfileRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/golang/v1/profile", pathParameters),
	}
	return m
}

// NewV1ProfileRequestBuilder instantiates a new ProfileRequestBuilder and sets the default values.
func NewV1ProfileRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *V1ProfileRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewV1ProfileRequestBuilderInternal(urlParams, requestAdapter)
}

// Delete this endpoint removes the specified ABHA profile along with all associated documents, vital records, and any other related data from the system.<Warning>Please note that the ABHA metadata will remain in the ABDM system, as ABDM does not provide a delete option</Warning>
func (m *V1ProfileRequestBuilder) Delete(ctx context.Context, requestConfiguration *V1ProfileRequestBuilderDeleteRequestConfiguration) error {
	requestInfo, err := m.ToDeleteRequestInformation(ctx, requestConfiguration)
	if err != nil {
		return err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
	}
	err = m.BaseRequestBuilder.RequestAdapter.SendNoContent(ctx, requestInfo, errorMapping)
	if err != nil {
		return err
	}
	return nil
}

// Get fetches the ABHA profile of the User. <Note>Please cache these results locally. We do not recommend calling this API on every page load. Evict the cache when there is profile update.</Note>
func (m *V1ProfileRequestBuilder) Get(ctx context.Context, requestConfiguration *V1ProfileRequestBuilderGetRequestConfiguration) (i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.ProfileResponseable, error) {
	requestInfo, err := m.ToGetRequestInformation(ctx, requestConfiguration)
	if err != nil {
		return nil, err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
	}
	res, err := m.BaseRequestBuilder.RequestAdapter.Send(ctx, requestInfo, i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateProfileResponseFromDiscriminatorValue, errorMapping)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, nil
	}
	return res.(i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.ProfileResponseable), nil
}

// Patch update Profile Details<Note>The API expects all the fields returned by the [Get Profiles API](/api-reference/user-app/golang-connect/profile/details/profile-details) to be included in the PATCH request body.</Note>
func (m *V1ProfileRequestBuilder) Patch(ctx context.Context, body i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.DetailsRequestType2able, requestConfiguration *V1ProfileRequestBuilderPatchRequestConfiguration) error {
	requestInfo, err := m.ToPatchRequestInformation(ctx, body, requestConfiguration)
	if err != nil {
		return err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"4XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
		"5XX": i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.CreateGenericErrorFromDiscriminatorValue,
	}
	err = m.BaseRequestBuilder.RequestAdapter.SendNoContent(ctx, requestInfo, errorMapping)
	if err != nil {
		return err
	}
	return nil
}

// Share the share property
func (m *V1ProfileRequestBuilder) Share() *V1ProfileShareRequestBuilder {
	return NewV1ProfileShareRequestBuilderInternal(m.BaseRequestBuilder.PathParameters, m.BaseRequestBuilder.RequestAdapter)
}

// ToDeleteRequestInformation this endpoint removes the specified ABHA profile along with all associated documents, vital records, and any other related data from the system.<Warning>Please note that the ABHA metadata will remain in the ABDM system, as ABDM does not provide a delete option</Warning>
func (m *V1ProfileRequestBuilder) ToDeleteRequestInformation(ctx context.Context, requestConfiguration *V1ProfileRequestBuilderDeleteRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
	requestInfo := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewRequestInformationWithMethodAndUrlTemplateAndPathParameters(i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.DELETE, m.BaseRequestBuilder.UrlTemplate, m.BaseRequestBuilder.PathParameters)
	if requestConfiguration != nil {
		requestInfo.Headers.AddAll(requestConfiguration.Headers)
		requestInfo.AddRequestOptions(requestConfiguration.Options)
	}
	requestInfo.Headers.TryAdd("Accept", "application/json")
	return requestInfo, nil
}

// ToGetRequestInformation fetches the ABHA profile of the User. <Note>Please cache these results locally. We do not recommend calling this API on every page load. Evict the cache when there is profile update.</Note>
func (m *V1ProfileRequestBuilder) ToGetRequestInformation(ctx context.Context, requestConfiguration *V1ProfileRequestBuilderGetRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
	requestInfo := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewRequestInformationWithMethodAndUrlTemplateAndPathParameters(i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.GET, m.BaseRequestBuilder.UrlTemplate, m.BaseRequestBuilder.PathParameters)
	if requestConfiguration != nil {
		requestInfo.Headers.AddAll(requestConfiguration.Headers)
		requestInfo.AddRequestOptions(requestConfiguration.Options)
	}
	requestInfo.Headers.TryAdd("Accept", "application/json")
	return requestInfo, nil
}

// ToPatchRequestInformation update Profile Details<Note>The API expects all the fields returned by the [Get Profiles API](/api-reference/user-app/golang-connect/profile/details/profile-details) to be included in the PATCH request body.</Note>
func (m *V1ProfileRequestBuilder) ToPatchRequestInformation(ctx context.Context, body i58c612fe3e5ec54ad94c41d439251ed1c7af6df05054720e7ce85897495ab0d7.DetailsRequestType2able, requestConfiguration *V1ProfileRequestBuilderPatchRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
	requestInfo := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewRequestInformationWithMethodAndUrlTemplateAndPathParameters(i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.PATCH, m.BaseRequestBuilder.UrlTemplate, m.BaseRequestBuilder.PathParameters)
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
func (m *V1ProfileRequestBuilder) WithUrl(rawUrl string) *V1ProfileRequestBuilder {
	return NewV1ProfileRequestBuilder(rawUrl, m.BaseRequestBuilder.RequestAdapter)
}
