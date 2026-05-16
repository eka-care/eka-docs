package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// VerifyRequestType5 
type VerifyRequestType5 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The otp property
    otp *string
    // The txn_id property
    txn_id *string
}
// NewVerifyRequestType5 instantiates a new VerifyRequestType5 and sets the default values.
func NewVerifyRequestType5()(*VerifyRequestType5) {
    m := &VerifyRequestType5{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateVerifyRequestType5FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateVerifyRequestType5FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewVerifyRequestType5(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *VerifyRequestType5) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *VerifyRequestType5) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["otp"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetOtp(val)
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
// GetOtp gets the otp property value. The otp property
func (m *VerifyRequestType5) GetOtp()(*string) {
    return m.otp
}
// GetTxnId gets the txn_id property value. The txn_id property
func (m *VerifyRequestType5) GetTxnId()(*string) {
    return m.txn_id
}
// Serialize serializes information the current object
func (m *VerifyRequestType5) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("otp", m.GetOtp())
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
// SetAdditionalData sets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *VerifyRequestType5) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetOtp sets the otp property value. The otp property
func (m *VerifyRequestType5) SetOtp(value *string)() {
    m.otp = value
}
// SetTxnId sets the txn_id property value. The txn_id property
func (m *VerifyRequestType5) SetTxnId(value *string)() {
    m.txn_id = value
}
// VerifyRequestType5able 
type VerifyRequestType5able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetOtp()(*string)
    GetTxnId()(*string)
    SetOtp(value *string)()
    SetTxnId(value *string)()
}
