package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// InitRequestType2 
type InitRequestType2 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The mobile_number property
    mobile_number *string
}
// NewInitRequestType2 instantiates a new InitRequestType2 and sets the default values.
func NewInitRequestType2()(*InitRequestType2) {
    m := &InitRequestType2{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateInitRequestType2FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateInitRequestType2FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewInitRequestType2(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *InitRequestType2) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *InitRequestType2) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["mobile_number"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetMobileNumber(val)
        }
        return nil
    }
    return res
}
// GetMobileNumber gets the mobile_number property value. The mobile_number property
func (m *InitRequestType2) GetMobileNumber()(*string) {
    return m.mobile_number
}
// Serialize serializes information the current object
func (m *InitRequestType2) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("mobile_number", m.GetMobileNumber())
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
func (m *InitRequestType2) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetMobileNumber sets the mobile_number property value. The mobile_number property
func (m *InitRequestType2) SetMobileNumber(value *string)() {
    m.mobile_number = value
}
// InitRequestType2able 
type InitRequestType2able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetMobileNumber()(*string)
    SetMobileNumber(value *string)()
}
