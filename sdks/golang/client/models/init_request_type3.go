package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// InitRequestType3 
type InitRequestType3 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The cc_ref_id property
    cc_ref_id *string
    // The patient_ref_id property
    patient_ref_id *string
    // The txn_id property
    txn_id *string
}
// NewInitRequestType3 instantiates a new InitRequestType3 and sets the default values.
func NewInitRequestType3()(*InitRequestType3) {
    m := &InitRequestType3{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateInitRequestType3FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateInitRequestType3FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewInitRequestType3(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *InitRequestType3) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetCcRefId gets the cc_ref_id property value. The cc_ref_id property
func (m *InitRequestType3) GetCcRefId()(*string) {
    return m.cc_ref_id
}
// GetFieldDeserializers the deserialization information for the current model
func (m *InitRequestType3) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["cc_ref_id"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetCcRefId(val)
        }
        return nil
    }
    res["patient_ref_id"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetPatientRefId(val)
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
// GetPatientRefId gets the patient_ref_id property value. The patient_ref_id property
func (m *InitRequestType3) GetPatientRefId()(*string) {
    return m.patient_ref_id
}
// GetTxnId gets the txn_id property value. The txn_id property
func (m *InitRequestType3) GetTxnId()(*string) {
    return m.txn_id
}
// Serialize serializes information the current object
func (m *InitRequestType3) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("cc_ref_id", m.GetCcRefId())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("patient_ref_id", m.GetPatientRefId())
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
func (m *InitRequestType3) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetCcRefId sets the cc_ref_id property value. The cc_ref_id property
func (m *InitRequestType3) SetCcRefId(value *string)() {
    m.cc_ref_id = value
}
// SetPatientRefId sets the patient_ref_id property value. The patient_ref_id property
func (m *InitRequestType3) SetPatientRefId(value *string)() {
    m.patient_ref_id = value
}
// SetTxnId sets the txn_id property value. The txn_id property
func (m *InitRequestType3) SetTxnId(value *string)() {
    m.txn_id = value
}
// InitRequestType3able 
type InitRequestType3able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetCcRefId()(*string)
    GetPatientRefId()(*string)
    GetTxnId()(*string)
    SetCcRefId(value *string)()
    SetPatientRefId(value *string)()
    SetTxnId(value *string)()
}
