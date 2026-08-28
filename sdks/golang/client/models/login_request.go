package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// LoginRequest 
type LoginRequest struct {
    // The abha_address property
    abha_address *string
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // Transaction ID received in the /init API
    txn_id *string
}
// NewLoginRequest instantiates a new LoginRequest and sets the default values.
func NewLoginRequest()(*LoginRequest) {
    m := &LoginRequest{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateLoginRequestFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateLoginRequestFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewLoginRequest(), nil
}
// GetAbhaAddress gets the abha_address property value. The abha_address property
func (m *LoginRequest) GetAbhaAddress()(*string) {
    return m.abha_address
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *LoginRequest) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *LoginRequest) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
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
// GetTxnId gets the txn_id property value. Transaction ID received in the /init API
func (m *LoginRequest) GetTxnId()(*string) {
    return m.txn_id
}
// Serialize serializes information the current object
func (m *LoginRequest) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("abha_address", m.GetAbhaAddress())
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
func (m *LoginRequest) SetAbhaAddress(value *string)() {
    m.abha_address = value
}
// SetAdditionalData sets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *LoginRequest) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetTxnId sets the txn_id property value. Transaction ID received in the /init API
func (m *LoginRequest) SetTxnId(value *string)() {
    m.txn_id = value
}
// LoginRequestable 
type LoginRequestable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetAbhaAddress()(*string)
    GetTxnId()(*string)
    SetAbhaAddress(value *string)()
    SetTxnId(value *string)()
}
