package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// DenyRequest 
type DenyRequest struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // Consent ID
    id *string
    // Users reason for denial in plain text
    reason *string
}
// NewDenyRequest instantiates a new DenyRequest and sets the default values.
func NewDenyRequest()(*DenyRequest) {
    m := &DenyRequest{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateDenyRequestFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateDenyRequestFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewDenyRequest(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *DenyRequest) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *DenyRequest) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
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
    res["reason"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetReason(val)
        }
        return nil
    }
    return res
}
// GetId gets the id property value. Consent ID
func (m *DenyRequest) GetId()(*string) {
    return m.id
}
// GetReason gets the reason property value. Users reason for denial in plain text
func (m *DenyRequest) GetReason()(*string) {
    return m.reason
}
// Serialize serializes information the current object
func (m *DenyRequest) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("id", m.GetId())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("reason", m.GetReason())
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
func (m *DenyRequest) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetId sets the id property value. Consent ID
func (m *DenyRequest) SetId(value *string)() {
    m.id = value
}
// SetReason sets the reason property value. Users reason for denial in plain text
func (m *DenyRequest) SetReason(value *string)() {
    m.reason = value
}
// DenyRequestable 
type DenyRequestable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetId()(*string)
    GetReason()(*string)
    SetId(value *string)()
    SetReason(value *string)()
}
