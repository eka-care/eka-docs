package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// DiscoverRequest 
type DiscoverRequest struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The hip_id property
    hip_id *string
    // The unique identifier for the patient within the Healthcare Information Provider (HIP), such as the patient's registration ID, email address, or phone number used at the hospital or lab.
    ref_id *string
}
// NewDiscoverRequest instantiates a new DiscoverRequest and sets the default values.
func NewDiscoverRequest()(*DiscoverRequest) {
    m := &DiscoverRequest{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateDiscoverRequestFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateDiscoverRequestFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewDiscoverRequest(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *DiscoverRequest) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *DiscoverRequest) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
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
    res["ref_id"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetRefId(val)
        }
        return nil
    }
    return res
}
// GetHipId gets the hip_id property value. The hip_id property
func (m *DiscoverRequest) GetHipId()(*string) {
    return m.hip_id
}
// GetRefId gets the ref_id property value. The unique identifier for the patient within the Healthcare Information Provider (HIP), such as the patient's registration ID, email address, or phone number used at the hospital or lab.
func (m *DiscoverRequest) GetRefId()(*string) {
    return m.ref_id
}
// Serialize serializes information the current object
func (m *DiscoverRequest) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("hip_id", m.GetHipId())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("ref_id", m.GetRefId())
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
func (m *DiscoverRequest) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetHipId sets the hip_id property value. The hip_id property
func (m *DiscoverRequest) SetHipId(value *string)() {
    m.hip_id = value
}
// SetRefId sets the ref_id property value. The unique identifier for the patient within the Healthcare Information Provider (HIP), such as the patient's registration ID, email address, or phone number used at the hospital or lab.
func (m *DiscoverRequest) SetRefId(value *string)() {
    m.ref_id = value
}
// DiscoverRequestable 
type DiscoverRequestable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetHipId()(*string)
    GetRefId()(*string)
    SetHipId(value *string)()
    SetRefId(value *string)()
}
