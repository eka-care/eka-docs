package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// VerifyResponseType2 
type VerifyResponseType2 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The eka property
    eka RegistrationEkaIdsable
    // The profile property
    profile ProfileResponseable
    // The skip_state property
    skip_state *VerifyResponseType2_skip_state
    // Transaction ID received in the /init API
    txn_id *string
}
// NewVerifyResponseType2 instantiates a new VerifyResponseType2 and sets the default values.
func NewVerifyResponseType2()(*VerifyResponseType2) {
    m := &VerifyResponseType2{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateVerifyResponseType2FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateVerifyResponseType2FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewVerifyResponseType2(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *VerifyResponseType2) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetEka gets the eka property value. The eka property
func (m *VerifyResponseType2) GetEka()(RegistrationEkaIdsable) {
    return m.eka
}
// GetFieldDeserializers the deserialization information for the current model
func (m *VerifyResponseType2) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["eka"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetObjectValue(CreateRegistrationEkaIdsFromDiscriminatorValue)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetEka(val.(RegistrationEkaIdsable))
        }
        return nil
    }
    res["profile"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetObjectValue(CreateProfileResponseFromDiscriminatorValue)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetProfile(val.(ProfileResponseable))
        }
        return nil
    }
    res["skip_state"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetEnumValue(ParseVerifyResponseType2_skip_state)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetSkipState(val.(*VerifyResponseType2_skip_state))
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
func (m *VerifyResponseType2) GetProfile()(ProfileResponseable) {
    return m.profile
}
// GetSkipState gets the skip_state property value. The skip_state property
func (m *VerifyResponseType2) GetSkipState()(*VerifyResponseType2_skip_state) {
    return m.skip_state
}
// GetTxnId gets the txn_id property value. Transaction ID received in the /init API
func (m *VerifyResponseType2) GetTxnId()(*string) {
    return m.txn_id
}
// Serialize serializes information the current object
func (m *VerifyResponseType2) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteObjectValue("eka", m.GetEka())
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
func (m *VerifyResponseType2) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetEka sets the eka property value. The eka property
func (m *VerifyResponseType2) SetEka(value RegistrationEkaIdsable)() {
    m.eka = value
}
// SetProfile sets the profile property value. The profile property
func (m *VerifyResponseType2) SetProfile(value ProfileResponseable)() {
    m.profile = value
}
// SetSkipState sets the skip_state property value. The skip_state property
func (m *VerifyResponseType2) SetSkipState(value *VerifyResponseType2_skip_state)() {
    m.skip_state = value
}
// SetTxnId sets the txn_id property value. Transaction ID received in the /init API
func (m *VerifyResponseType2) SetTxnId(value *string)() {
    m.txn_id = value
}
// VerifyResponseType2able 
type VerifyResponseType2able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetEka()(RegistrationEkaIdsable)
    GetProfile()(ProfileResponseable)
    GetSkipState()(*VerifyResponseType2_skip_state)
    GetTxnId()(*string)
    SetEka(value RegistrationEkaIdsable)()
    SetProfile(value ProfileResponseable)()
    SetSkipState(value *VerifyResponseType2_skip_state)()
    SetTxnId(value *string)()
}
