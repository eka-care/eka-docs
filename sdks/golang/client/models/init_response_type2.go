package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// InitResponseType2 
type InitResponseType2 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // Transaction id received in the /init API
    txn_id *string
}
// NewInitResponseType2 instantiates a new InitResponseType2 and sets the default values.
func NewInitResponseType2()(*InitResponseType2) {
    m := &InitResponseType2{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateInitResponseType2FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateInitResponseType2FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewInitResponseType2(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *InitResponseType2) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *InitResponseType2) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
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
// GetTxnId gets the txn_id property value. Transaction id received in the /init API
func (m *InitResponseType2) GetTxnId()(*string) {
    return m.txn_id
}
// Serialize serializes information the current object
func (m *InitResponseType2) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
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
func (m *InitResponseType2) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetTxnId sets the txn_id property value. Transaction id received in the /init API
func (m *InitResponseType2) SetTxnId(value *string)() {
    m.txn_id = value
}
// InitResponseType2able 
type InitResponseType2able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetTxnId()(*string)
    SetTxnId(value *string)()
}
