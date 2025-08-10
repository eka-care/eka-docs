package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// CreateRequestType2 
type CreateRequestType2 struct {
    // The abha_address property
    abha_address *string
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The profile property
    profile DetailsRequestType2able
    // Transaction ID received in the /init API
    txn_id *string
}
// NewCreateRequestType2 instantiates a new CreateRequestType2 and sets the default values.
func NewCreateRequestType2()(*CreateRequestType2) {
    m := &CreateRequestType2{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateCreateRequestType2FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateCreateRequestType2FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewCreateRequestType2(), nil
}
// GetAbhaAddress gets the abha_address property value. The abha_address property
func (m *CreateRequestType2) GetAbhaAddress()(*string) {
    return m.abha_address
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *CreateRequestType2) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *CreateRequestType2) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
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
    res["profile"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetObjectValue(CreateDetailsRequestType2FromDiscriminatorValue)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetProfile(val.(DetailsRequestType2able))
        }
        return nil
    }
    res["txn_id"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetTxnId(val)
        }
        return nil
    }
    return res
}
// GetProfile gets the profile property value. The profile property
func (m *CreateRequestType2) GetProfile()(DetailsRequestType2able) {
    return m.profile
}
// GetTxnId gets the txn_id property value. Transaction ID received in the /init API
func (m *CreateRequestType2) GetTxnId()(*string) {
    return m.txn_id
}
// Serialize serializes information the current object
func (m *CreateRequestType2) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("abha_address", m.GetAbhaAddress())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteObjectValue("profile", m.GetProfile())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("txn_id", m.GetTxnId())
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
func (m *CreateRequestType2) SetAbhaAddress(value *string)() {
    m.abha_address = value
}
// SetAdditionalData sets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *CreateRequestType2) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetProfile sets the profile property value. The profile property
func (m *CreateRequestType2) SetProfile(value DetailsRequestType2able)() {
    m.profile = value
}
// SetTxnId sets the txn_id property value. Transaction ID received in the /init API
func (m *CreateRequestType2) SetTxnId(value *string)() {
    m.txn_id = value
}
// CreateRequestType2able 
type CreateRequestType2able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetAbhaAddress()(*string)
    GetProfile()(DetailsRequestType2able)
    GetTxnId()(*string)
    SetAbhaAddress(value *string)()
    SetProfile(value DetailsRequestType2able)()
    SetTxnId(value *string)()
}
