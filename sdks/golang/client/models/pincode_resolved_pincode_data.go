package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// PincodeResolvedPincodeData 
type PincodeResolvedPincodeData struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The dist_code property
    dist_code *string
    // The dist_name property
    dist_name *string
    // The pincode property
    pincode *string
    // The state_code property
    state_code *string
    // The state_name property
    state_name *string
}
// NewPincodeResolvedPincodeData instantiates a new PincodeResolvedPincodeData and sets the default values.
func NewPincodeResolvedPincodeData()(*PincodeResolvedPincodeData) {
    m := &PincodeResolvedPincodeData{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreatePincodeResolvedPincodeDataFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreatePincodeResolvedPincodeDataFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewPincodeResolvedPincodeData(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *PincodeResolvedPincodeData) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetDistCode gets the dist_code property value. The dist_code property
func (m *PincodeResolvedPincodeData) GetDistCode()(*string) {
    return m.dist_code
}
// GetDistName gets the dist_name property value. The dist_name property
func (m *PincodeResolvedPincodeData) GetDistName()(*string) {
    return m.dist_name
}
// GetFieldDeserializers the deserialization information for the current model
func (m *PincodeResolvedPincodeData) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["dist_code"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetDistCode(val)
        }
        return nil
    }
    res["dist_name"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetDistName(val)
        }
        return nil
    }
    res["pincode"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetPincode(val)
        }
        return nil
    }
    res["state_code"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetStateCode(val)
        }
        return nil
    }
    res["state_name"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetStateName(val)
        }
        return nil
    }
    return res
}
// GetPincode gets the pincode property value. The pincode property
func (m *PincodeResolvedPincodeData) GetPincode()(*string) {
    return m.pincode
}
// GetStateCode gets the state_code property value. The state_code property
func (m *PincodeResolvedPincodeData) GetStateCode()(*string) {
    return m.state_code
}
// GetStateName gets the state_name property value. The state_name property
func (m *PincodeResolvedPincodeData) GetStateName()(*string) {
    return m.state_name
}
// Serialize serializes information the current object
func (m *PincodeResolvedPincodeData) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("dist_code", m.GetDistCode())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("dist_name", m.GetDistName())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("pincode", m.GetPincode())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("state_code", m.GetStateCode())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("state_name", m.GetStateName())
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
func (m *PincodeResolvedPincodeData) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetDistCode sets the dist_code property value. The dist_code property
func (m *PincodeResolvedPincodeData) SetDistCode(value *string)() {
    m.dist_code = value
}
// SetDistName sets the dist_name property value. The dist_name property
func (m *PincodeResolvedPincodeData) SetDistName(value *string)() {
    m.dist_name = value
}
// SetPincode sets the pincode property value. The pincode property
func (m *PincodeResolvedPincodeData) SetPincode(value *string)() {
    m.pincode = value
}
// SetStateCode sets the state_code property value. The state_code property
func (m *PincodeResolvedPincodeData) SetStateCode(value *string)() {
    m.state_code = value
}
// SetStateName sets the state_name property value. The state_name property
func (m *PincodeResolvedPincodeData) SetStateName(value *string)() {
    m.state_name = value
}
// PincodeResolvedPincodeDataable 
type PincodeResolvedPincodeDataable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetDistCode()(*string)
    GetDistName()(*string)
    GetPincode()(*string)
    GetStateCode()(*string)
    GetStateName()(*string)
    SetDistCode(value *string)()
    SetDistName(value *string)()
    SetPincode(value *string)()
    SetStateCode(value *string)()
    SetStateName(value *string)()
}
