package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// VerifyResponseType3 
type VerifyResponseType3 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The skip_state property
    skip_state *VerifyResponseType3_skip_state
    // The txn_id property
    txn_id *string
}
// NewVerifyResponseType3 instantiates a new VerifyResponseType3 and sets the default values.
func NewVerifyResponseType3()(*VerifyResponseType3) {
    m := &VerifyResponseType3{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateVerifyResponseType3FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateVerifyResponseType3FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewVerifyResponseType3(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *VerifyResponseType3) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *VerifyResponseType3) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["skip_state"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetEnumValue(ParseVerifyResponseType3_skip_state)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetSkipState(val.(*VerifyResponseType3_skip_state))
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
// GetSkipState gets the skip_state property value. The skip_state property
func (m *VerifyResponseType3) GetSkipState()(*VerifyResponseType3_skip_state) {
    return m.skip_state
}
// GetTxnId gets the txn_id property value. The txn_id property
func (m *VerifyResponseType3) GetTxnId()(*string) {
    return m.txn_id
}
// Serialize serializes information the current object
func (m *VerifyResponseType3) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    if m.GetSkipState() != nil {
        cast := (*m.GetSkipState()).String()
        err := writer.WriteStringValue("skip_state", &cast)
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
func (m *VerifyResponseType3) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetSkipState sets the skip_state property value. The skip_state property
func (m *VerifyResponseType3) SetSkipState(value *VerifyResponseType3_skip_state)() {
    m.skip_state = value
}
// SetTxnId sets the txn_id property value. The txn_id property
func (m *VerifyResponseType3) SetTxnId(value *string)() {
    m.txn_id = value
}
// VerifyResponseType3able 
type VerifyResponseType3able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetSkipState()(*VerifyResponseType3_skip_state)
    GetTxnId()(*string)
    SetSkipState(value *VerifyResponseType3_skip_state)()
    SetTxnId(value *string)()
}
