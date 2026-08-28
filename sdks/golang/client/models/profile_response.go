package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// ProfileResponse 
type ProfileResponse struct {
    // The abha_address property
    abha_address *string
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The gender property
    gender *ProfileResponse_gender
}
// NewProfileResponse instantiates a new ProfileResponse and sets the default values.
func NewProfileResponse()(*ProfileResponse) {
    m := &ProfileResponse{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateProfileResponseFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateProfileResponseFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewProfileResponse(), nil
}
// GetAbhaAddress gets the abha_address property value. The abha_address property
func (m *ProfileResponse) GetAbhaAddress()(*string) {
    return m.abha_address
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *ProfileResponse) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *ProfileResponse) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
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
    res["gender"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetEnumValue(ParseProfileResponse_gender)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetGender(val.(*ProfileResponse_gender))
        }
        return nil
    }
    return res
}
// GetGender gets the gender property value. The gender property
func (m *ProfileResponse) GetGender()(*ProfileResponse_gender) {
    return m.gender
}
// Serialize serializes information the current object
func (m *ProfileResponse) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("abha_address", m.GetAbhaAddress())
        if err != nil {
            return err
        }
    }
    if m.GetGender() != nil {
        cast := (*m.GetGender()).String()
        err := writer.WriteStringValue("gender", &cast)
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
func (m *ProfileResponse) SetAbhaAddress(value *string)() {
    m.abha_address = value
}
// SetAdditionalData sets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *ProfileResponse) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetGender sets the gender property value. The gender property
func (m *ProfileResponse) SetGender(value *ProfileResponse_gender)() {
    m.gender = value
}
// ProfileResponseable 
type ProfileResponseable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetAbhaAddress()(*string)
    GetGender()(*ProfileResponse_gender)
    SetAbhaAddress(value *string)()
    SetGender(value *ProfileResponse_gender)()
}
