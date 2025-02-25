package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// HipLocation 
type HipLocation struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The latitude property
    latitude *string
    // The longitude property
    longitude *string
}
// NewHipLocation instantiates a new HipLocation and sets the default values.
func NewHipLocation()(*HipLocation) {
    m := &HipLocation{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateHipLocationFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateHipLocationFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewHipLocation(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *HipLocation) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *HipLocation) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["latitude"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetLatitude(val)
        }
        return nil
    }
    res["longitude"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetLongitude(val)
        }
        return nil
    }
    return res
}
// GetLatitude gets the latitude property value. The latitude property
func (m *HipLocation) GetLatitude()(*string) {
    return m.latitude
}
// GetLongitude gets the longitude property value. The longitude property
func (m *HipLocation) GetLongitude()(*string) {
    return m.longitude
}
// Serialize serializes information the current object
func (m *HipLocation) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("latitude", m.GetLatitude())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("longitude", m.GetLongitude())
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
func (m *HipLocation) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetLatitude sets the latitude property value. The latitude property
func (m *HipLocation) SetLatitude(value *string)() {
    m.latitude = value
}
// SetLongitude sets the longitude property value. The longitude property
func (m *HipLocation) SetLongitude(value *string)() {
    m.longitude = value
}
// HipLocationable 
type HipLocationable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetLatitude()(*string)
    GetLongitude()(*string)
    SetLatitude(value *string)()
    SetLongitude(value *string)()
}
