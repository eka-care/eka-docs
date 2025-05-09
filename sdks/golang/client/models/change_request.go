package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// ChangeRequest 
type ChangeRequest struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The new property
    new *string
    // The old property
    old *string
}
// NewChangeRequest instantiates a new ChangeRequest and sets the default values.
func NewChangeRequest()(*ChangeRequest) {
    m := &ChangeRequest{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateChangeRequestFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateChangeRequestFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewChangeRequest(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *ChangeRequest) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *ChangeRequest) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["new"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetNew(val)
        }
        return nil
    }
    res["old"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetOld(val)
        }
        return nil
    }
    return res
}
// GetNew gets the new property value. The new property
func (m *ChangeRequest) GetNew()(*string) {
    return m.new
}
// GetOld gets the old property value. The old property
func (m *ChangeRequest) GetOld()(*string) {
    return m.old
}
// Serialize serializes information the current object
func (m *ChangeRequest) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("new", m.GetNew())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("old", m.GetOld())
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
func (m *ChangeRequest) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetNew sets the new property value. The new property
func (m *ChangeRequest) SetNew(value *string)() {
    m.new = value
}
// SetOld sets the old property value. The old property
func (m *ChangeRequest) SetOld(value *string)() {
    m.old = value
}
// ChangeRequestable 
type ChangeRequestable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetNew()(*string)
    GetOld()(*string)
    SetNew(value *string)()
    SetOld(value *string)()
}
