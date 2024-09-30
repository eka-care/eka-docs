package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// InitRequest 
type InitRequest struct {
    // The aadhaar_number property
    aadhaar_number *string
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
}
// NewInitRequest instantiates a new InitRequest and sets the default values.
func NewInitRequest()(*InitRequest) {
    m := &InitRequest{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateInitRequestFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateInitRequestFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewInitRequest(), nil
}
// GetAadhaarNumber gets the aadhaar_number property value. The aadhaar_number property
func (m *InitRequest) GetAadhaarNumber()(*string) {
    return m.aadhaar_number
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *InitRequest) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *InitRequest) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["aadhaar_number"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetAadhaarNumber(val)
        }
        return nil
    }
    return res
}
// Serialize serializes information the current object
func (m *InitRequest) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("aadhaar_number", m.GetAadhaarNumber())
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
// SetAadhaarNumber sets the aadhaar_number property value. The aadhaar_number property
func (m *InitRequest) SetAadhaarNumber(value *string)() {
    m.aadhaar_number = value
}
// SetAdditionalData sets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *InitRequest) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// InitRequestable 
type InitRequestable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetAadhaarNumber()(*string)
    SetAadhaarNumber(value *string)()
}
