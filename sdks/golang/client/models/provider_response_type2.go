package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// ProviderResponseType2 
type ProviderResponseType2 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The hip_id property
    hip_id *string
}
// NewProviderResponseType2 instantiates a new ProviderResponseType2 and sets the default values.
func NewProviderResponseType2()(*ProviderResponseType2) {
    m := &ProviderResponseType2{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateProviderResponseType2FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateProviderResponseType2FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewProviderResponseType2(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *ProviderResponseType2) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *ProviderResponseType2) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["hip_id"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetHipId(val)
        }
        return nil
    }
    return res
}
// GetHipId gets the hip_id property value. The hip_id property
func (m *ProviderResponseType2) GetHipId()(*string) {
    return m.hip_id
}
// Serialize serializes information the current object
func (m *ProviderResponseType2) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("hip_id", m.GetHipId())
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
func (m *ProviderResponseType2) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetHipId sets the hip_id property value. The hip_id property
func (m *ProviderResponseType2) SetHipId(value *string)() {
    m.hip_id = value
}
// ProviderResponseType2able 
type ProviderResponseType2able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetHipId()(*string)
    SetHipId(value *string)()
}
