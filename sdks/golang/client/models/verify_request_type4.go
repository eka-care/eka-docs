package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// VerifyRequestType4 
type VerifyRequestType4 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The pin property
    pin *string
    // The scope property
    scope *string
}
// NewVerifyRequestType4 instantiates a new VerifyRequestType4 and sets the default values.
func NewVerifyRequestType4()(*VerifyRequestType4) {
    m := &VerifyRequestType4{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateVerifyRequestType4FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateVerifyRequestType4FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewVerifyRequestType4(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *VerifyRequestType4) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *VerifyRequestType4) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["pin"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetPin(val)
        }
        return nil
    }
    res["scope"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetScope(val)
        }
        return nil
    }
    return res
}
// GetPin gets the pin property value. The pin property
func (m *VerifyRequestType4) GetPin()(*string) {
    return m.pin
}
// GetScope gets the scope property value. The scope property
func (m *VerifyRequestType4) GetScope()(*string) {
    return m.scope
}
// Serialize serializes information the current object
func (m *VerifyRequestType4) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("pin", m.GetPin())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("scope", m.GetScope())
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
func (m *VerifyRequestType4) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetPin sets the pin property value. The pin property
func (m *VerifyRequestType4) SetPin(value *string)() {
    m.pin = value
}
// SetScope sets the scope property value. The scope property
func (m *VerifyRequestType4) SetScope(value *string)() {
    m.scope = value
}
// VerifyRequestType4able 
type VerifyRequestType4able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetPin()(*string)
    GetScope()(*string)
    SetPin(value *string)()
    SetScope(value *string)()
}
