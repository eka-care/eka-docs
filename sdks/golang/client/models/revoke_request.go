package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// RevokeRequest 
type RevokeRequest struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The pin_detail property
    pin_detail CommonsPinDetailable
}
// NewRevokeRequest instantiates a new RevokeRequest and sets the default values.
func NewRevokeRequest()(*RevokeRequest) {
    m := &RevokeRequest{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateRevokeRequestFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateRevokeRequestFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewRevokeRequest(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *RevokeRequest) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *RevokeRequest) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["pin_detail"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetObjectValue(CreateCommonsPinDetailFromDiscriminatorValue)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetPinDetail(val.(CommonsPinDetailable))
        }
        return nil
    }
    return res
}
// GetPinDetail gets the pin_detail property value. The pin_detail property
func (m *RevokeRequest) GetPinDetail()(CommonsPinDetailable) {
    return m.pin_detail
}
// Serialize serializes information the current object
func (m *RevokeRequest) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteObjectValue("pin_detail", m.GetPinDetail())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteAdditionalData(m.GetAdditionalData())
        if err != nil {
            return err
        }
    }
    return nil
}
// SetAdditionalData sets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *RevokeRequest) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetPinDetail sets the pin_detail property value. The pin_detail property
func (m *RevokeRequest) SetPinDetail(value CommonsPinDetailable)() {
    m.pin_detail = value
}
// RevokeRequestable 
type RevokeRequestable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetPinDetail()(CommonsPinDetailable)
    SetPinDetail(value CommonsPinDetailable)()
}
