package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// ScanandshareRequest 
type ScanandshareRequest struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // Counter ID
    counter_id *string
    // HIP ID from QR Code
    hip_id *string
    // The location property
    location HipLocationable
}
// NewScanandshareRequest instantiates a new ScanandshareRequest and sets the default values.
func NewScanandshareRequest()(*ScanandshareRequest) {
    m := &ScanandshareRequest{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateScanandshareRequestFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateScanandshareRequestFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewScanandshareRequest(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *ScanandshareRequest) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetCounterId gets the counter_id property value. Counter ID
func (m *ScanandshareRequest) GetCounterId()(*string) {
    return m.counter_id
}
// GetFieldDeserializers the deserialization information for the current model
func (m *ScanandshareRequest) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["counter_id"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetCounterId(val)
        }
        return nil
    }
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
    res["location"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetObjectValue(CreateHipLocationFromDiscriminatorValue)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetLocation(val.(HipLocationable))
        }
        return nil
    }
    return res
}
// GetHipId gets the hip_id property value. HIP ID from QR Code
func (m *ScanandshareRequest) GetHipId()(*string) {
    return m.hip_id
}
// GetLocation gets the location property value. The location property
func (m *ScanandshareRequest) GetLocation()(HipLocationable) {
    return m.location
}
// Serialize serializes information the current object
func (m *ScanandshareRequest) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("counter_id", m.GetCounterId())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("hip_id", m.GetHipId())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteObjectValue("location", m.GetLocation())
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
func (m *ScanandshareRequest) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetCounterId sets the counter_id property value. Counter ID
func (m *ScanandshareRequest) SetCounterId(value *string)() {
    m.counter_id = value
}
// SetHipId sets the hip_id property value. HIP ID from QR Code
func (m *ScanandshareRequest) SetHipId(value *string)() {
    m.hip_id = value
}
// SetLocation sets the location property value. The location property
func (m *ScanandshareRequest) SetLocation(value HipLocationable)() {
    m.location = value
}
// ScanandshareRequestable 
type ScanandshareRequestable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetCounterId()(*string)
    GetHipId()(*string)
    GetLocation()(HipLocationable)
    SetCounterId(value *string)()
    SetHipId(value *string)()
    SetLocation(value HipLocationable)()
}
