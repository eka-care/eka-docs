package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// DetailsRequestType2 
type DetailsRequestType2 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The gender property
    gender *DetailsRequestType2_gender
}
// NewDetailsRequestType2 instantiates a new DetailsRequestType2 and sets the default values.
func NewDetailsRequestType2()(*DetailsRequestType2) {
    m := &DetailsRequestType2{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateDetailsRequestType2FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateDetailsRequestType2FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewDetailsRequestType2(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *DetailsRequestType2) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *DetailsRequestType2) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["gender"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetEnumValue(ParseDetailsRequestType2_gender)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetGender(val.(*DetailsRequestType2_gender))
        }
        return nil
    }
    return res
}
// GetGender gets the gender property value. The gender property
func (m *DetailsRequestType2) GetGender()(*DetailsRequestType2_gender) {
    return m.gender
}
// Serialize serializes information the current object
func (m *DetailsRequestType2) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
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
// SetAdditionalData sets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *DetailsRequestType2) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetGender sets the gender property value. The gender property
func (m *DetailsRequestType2) SetGender(value *DetailsRequestType2_gender)() {
    m.gender = value
}
// DetailsRequestType2able 
type DetailsRequestType2able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetGender()(*DetailsRequestType2_gender)
    SetGender(value *DetailsRequestType2_gender)()
}
