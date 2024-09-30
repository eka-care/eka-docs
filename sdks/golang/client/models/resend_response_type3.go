package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// ResendResponseType3 
type ResendResponseType3 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The hint property
    hint *string
    // The txn_id property
    txn_id *string
}
// NewResendResponseType3 instantiates a new ResendResponseType3 and sets the default values.
func NewResendResponseType3()(*ResendResponseType3) {
    m := &ResendResponseType3{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateResendResponseType3FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateResendResponseType3FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewResendResponseType3(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *ResendResponseType3) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *ResendResponseType3) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["hint"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetHint(val)
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
// GetHint gets the hint property value. The hint property
func (m *ResendResponseType3) GetHint()(*string) {
    return m.hint
}
// GetTxnId gets the txn_id property value. The txn_id property
func (m *ResendResponseType3) GetTxnId()(*string) {
    return m.txn_id
}
// Serialize serializes information the current object
func (m *ResendResponseType3) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("hint", m.GetHint())
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
func (m *ResendResponseType3) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetHint sets the hint property value. The hint property
func (m *ResendResponseType3) SetHint(value *string)() {
    m.hint = value
}
// SetTxnId sets the txn_id property value. The txn_id property
func (m *ResendResponseType3) SetTxnId(value *string)() {
    m.txn_id = value
}
// ResendResponseType3able 
type ResendResponseType3able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetHint()(*string)
    GetTxnId()(*string)
    SetHint(value *string)()
    SetTxnId(value *string)()
}
