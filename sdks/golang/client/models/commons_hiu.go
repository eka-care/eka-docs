package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// CommonsHiu 
type CommonsHiu struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // Health Information User ID
    id *string
    // Name of the Health Information User
    name *string
}
// NewCommonsHiu instantiates a new CommonsHiu and sets the default values.
func NewCommonsHiu()(*CommonsHiu) {
    m := &CommonsHiu{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateCommonsHiuFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateCommonsHiuFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewCommonsHiu(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *CommonsHiu) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *CommonsHiu) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
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
    res["name"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetName(val)
        }
        return nil
    }
    return res
}
// GetId gets the id property value. Health Information User ID
func (m *CommonsHiu) GetId()(*string) {
    return m.id
}
// GetName gets the name property value. Name of the Health Information User
func (m *CommonsHiu) GetName()(*string) {
    return m.name
}
// Serialize serializes information the current object
func (m *CommonsHiu) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("id", m.GetId())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("name", m.GetName())
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
func (m *CommonsHiu) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetId sets the id property value. Health Information User ID
func (m *CommonsHiu) SetId(value *string)() {
    m.id = value
}
// SetName sets the name property value. Name of the Health Information User
func (m *CommonsHiu) SetName(value *string)() {
    m.name = value
}
// CommonsHiuable 
type CommonsHiuable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetId()(*string)
    GetName()(*string)
    SetId(value *string)()
    SetName(value *string)()
}
