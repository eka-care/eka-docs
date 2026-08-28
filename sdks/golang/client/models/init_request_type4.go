package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// InitRequestType4 
type InitRequestType4 struct {
    // The abha_address property
    abha_address *string
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
}
// NewInitRequestType4 instantiates a new InitRequestType4 and sets the default values.
func NewInitRequestType4()(*InitRequestType4) {
    m := &InitRequestType4{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateInitRequestType4FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateInitRequestType4FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewInitRequestType4(), nil
}
// GetAbhaAddress gets the abha_address property value. The abha_address property
func (m *InitRequestType4) GetAbhaAddress()(*string) {
    return m.abha_address
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *InitRequestType4) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *InitRequestType4) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["abha_address"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetAbhaAddress(val)
        }
        return nil
    }
    return res
}
// Serialize serializes information the current object
func (m *InitRequestType4) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("abha_address", m.GetAbhaAddress())
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
// SetAbhaAddress sets the abha_address property value. The abha_address property
func (m *InitRequestType4) SetAbhaAddress(value *string)() {
    m.abha_address = value
}
// SetAdditionalData sets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *InitRequestType4) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// InitRequestType4able 
type InitRequestType4able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetAbhaAddress()(*string)
    SetAbhaAddress(value *string)()
}
