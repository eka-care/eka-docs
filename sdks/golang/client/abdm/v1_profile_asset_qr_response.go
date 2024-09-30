package abdm

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// V1ProfileAssetQrResponse 
// Deprecated: This class is obsolete. Use qrGetResponse instead.
type V1ProfileAssetQrResponse struct {
    V1ProfileAssetQrGetResponse
}
// NewV1ProfileAssetQrResponse instantiates a new V1ProfileAssetQrResponse and sets the default values.
func NewV1ProfileAssetQrResponse()(*V1ProfileAssetQrResponse) {
    m := &V1ProfileAssetQrResponse{
        V1ProfileAssetQrGetResponse: *NewV1ProfileAssetQrGetResponse(),
    }
    return m
}
// CreateV1ProfileAssetQrResponseFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateV1ProfileAssetQrResponseFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewV1ProfileAssetQrResponse(), nil
}
// V1ProfileAssetQrResponseable 
// Deprecated: This class is obsolete. Use qrGetResponse instead.
type V1ProfileAssetQrResponseable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    V1ProfileAssetQrGetResponseable
}
