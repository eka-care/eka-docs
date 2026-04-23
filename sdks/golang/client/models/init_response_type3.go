package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// InitResponseType3 
type InitResponseType3 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The expiry_in_minutes property
    expiry_in_minutes *int32
    // Medium which is used to generate otp
    medium *string
    // Value of medium
    otp_medium_value *string
    // The txn_id property
    txn_id *string
}
// NewInitResponseType3 instantiates a new InitResponseType3 and sets the default values.
func NewInitResponseType3()(*InitResponseType3) {
    m := &InitResponseType3{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateInitResponseType3FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateInitResponseType3FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewInitResponseType3(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *InitResponseType3) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetExpiryInMinutes gets the expiry_in_minutes property value. The expiry_in_minutes property
func (m *InitResponseType3) GetExpiryInMinutes()(*int32) {
    return m.expiry_in_minutes
}
// GetFieldDeserializers the deserialization information for the current model
func (m *InitResponseType3) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["expiry_in_minutes"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetInt32Value()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetExpiryInMinutes(val)
        }
        return nil
    }
    res["medium"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetMedium(val)
        }
        return nil
    }
    res["otp_medium_value"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetOtpMediumValue(val)
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
// GetMedium gets the medium property value. Medium which is used to generate otp
func (m *InitResponseType3) GetMedium()(*string) {
    return m.medium
}
// GetOtpMediumValue gets the otp_medium_value property value. Value of medium
func (m *InitResponseType3) GetOtpMediumValue()(*string) {
    return m.otp_medium_value
}
// GetTxnId gets the txn_id property value. The txn_id property
func (m *InitResponseType3) GetTxnId()(*string) {
    return m.txn_id
}
// Serialize serializes information the current object
func (m *InitResponseType3) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteInt32Value("expiry_in_minutes", m.GetExpiryInMinutes())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("medium", m.GetMedium())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("otp_medium_value", m.GetOtpMediumValue())
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
func (m *InitResponseType3) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetExpiryInMinutes sets the expiry_in_minutes property value. The expiry_in_minutes property
func (m *InitResponseType3) SetExpiryInMinutes(value *int32)() {
    m.expiry_in_minutes = value
}
// SetMedium sets the medium property value. Medium which is used to generate otp
func (m *InitResponseType3) SetMedium(value *string)() {
    m.medium = value
}
// SetOtpMediumValue sets the otp_medium_value property value. Value of medium
func (m *InitResponseType3) SetOtpMediumValue(value *string)() {
    m.otp_medium_value = value
}
// SetTxnId sets the txn_id property value. The txn_id property
func (m *InitResponseType3) SetTxnId(value *string)() {
    m.txn_id = value
}
// InitResponseType3able 
type InitResponseType3able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetExpiryInMinutes()(*int32)
    GetMedium()(*string)
    GetOtpMediumValue()(*string)
    GetTxnId()(*string)
    SetExpiryInMinutes(value *int32)()
    SetMedium(value *string)()
    SetOtpMediumValue(value *string)()
    SetTxnId(value *string)()
}
