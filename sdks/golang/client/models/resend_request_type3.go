package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// ResendRequestType3 
type ResendRequestType3 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // Transaction ID received in the /init API
    txn_id *string
}
// NewResendRequestType3 instantiates a new ResendRequestType3 and sets the default values.
func NewResendRequestType3()(*ResendRequestType3) {
    m := &ResendRequestType3{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateResendRequestType3FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateResendRequestType3FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewResendRequestType3(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *ResendRequestType3) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *ResendRequestType3) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
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
// GetTxnId gets the txn_id property value. Transaction ID received in the /init API
func (m *ResendRequestType3) GetTxnId()(*string) {
    return m.txn_id
}
// Serialize serializes information the current object
func (m *ResendRequestType3) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
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
func (m *ResendRequestType3) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetTxnId sets the txn_id property value. Transaction ID received in the /init API
func (m *ResendRequestType3) SetTxnId(value *string)() {
    m.txn_id = value
}
// ResendRequestType3able 
type ResendRequestType3able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetTxnId()(*string)
    SetTxnId(value *string)()
}
