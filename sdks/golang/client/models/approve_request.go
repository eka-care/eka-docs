package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// ApproveRequest 
type ApproveRequest struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The id property
    id *string
    // The pin_detail property
    pin_detail CommonsPinDetailable
}
// NewApproveRequest instantiates a new ApproveRequest and sets the default values.
func NewApproveRequest()(*ApproveRequest) {
    m := &ApproveRequest{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateApproveRequestFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateApproveRequestFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewApproveRequest(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *ApproveRequest) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *ApproveRequest) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["id"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetId(val)
        }
        return nil
    }
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
// GetId gets the id property value. The id property
func (m *ApproveRequest) GetId()(*string) {
    return m.id
}
// GetPinDetail gets the pin_detail property value. The pin_detail property
func (m *ApproveRequest) GetPinDetail()(CommonsPinDetailable) {
    return m.pin_detail
}
// Serialize serializes information the current object
func (m *ApproveRequest) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("id", m.GetId())
        if err != nil {
            return err
        }
    }
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
func (m *ApproveRequest) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetId sets the id property value. The id property
func (m *ApproveRequest) SetId(value *string)() {
    m.id = value
}
// SetPinDetail sets the pin_detail property value. The pin_detail property
func (m *ApproveRequest) SetPinDetail(value CommonsPinDetailable)() {
    m.pin_detail = value
}
// ApproveRequestable 
type ApproveRequestable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetId()(*string)
    GetPinDetail()(CommonsPinDetailable)
    SetId(value *string)()
    SetPinDetail(value CommonsPinDetailable)()
}
