package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// CreateResponseType2 
type CreateResponseType2 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The eka property
    eka RegistrationEkaIdsable
    // The profile property
    profile ProfileResponseable
    // The skip_state property
    skip_state *CreateResponseType2_skip_state
    // The success property
    success *bool
}
// NewCreateResponseType2 instantiates a new CreateResponseType2 and sets the default values.
func NewCreateResponseType2()(*CreateResponseType2) {
    m := &CreateResponseType2{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateCreateResponseType2FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateCreateResponseType2FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewCreateResponseType2(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *CreateResponseType2) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetEka gets the eka property value. The eka property
func (m *CreateResponseType2) GetEka()(RegistrationEkaIdsable) {
    return m.eka
}
// GetFieldDeserializers the deserialization information for the current model
func (m *CreateResponseType2) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
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
        val, err := n.GetEnumValue(ParseCreateResponseType2_skip_state)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetSkipState(val.(*CreateResponseType2_skip_state))
        }
        return nil
    }
    res["success"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetBoolValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetSuccess(val)
        }
        return nil
    }
    return res
}
// GetProfile gets the profile property value. The profile property
func (m *CreateResponseType2) GetProfile()(ProfileResponseable) {
    return m.profile
}
// GetSkipState gets the skip_state property value. The skip_state property
func (m *CreateResponseType2) GetSkipState()(*CreateResponseType2_skip_state) {
    return m.skip_state
}
// GetSuccess gets the success property value. The success property
func (m *CreateResponseType2) GetSuccess()(*bool) {
    return m.success
}
// Serialize serializes information the current object
func (m *CreateResponseType2) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
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
        err := writer.WriteBoolValue("success", m.GetSuccess())
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
func (m *CreateResponseType2) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetEka sets the eka property value. The eka property
func (m *CreateResponseType2) SetEka(value RegistrationEkaIdsable)() {
    m.eka = value
}
// SetProfile sets the profile property value. The profile property
func (m *CreateResponseType2) SetProfile(value ProfileResponseable)() {
    m.profile = value
}
// SetSkipState sets the skip_state property value. The skip_state property
func (m *CreateResponseType2) SetSkipState(value *CreateResponseType2_skip_state)() {
    m.skip_state = value
}
// SetSuccess sets the success property value. The success property
func (m *CreateResponseType2) SetSuccess(value *bool)() {
    m.success = value
}
// CreateResponseType2able 
type CreateResponseType2able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetEka()(RegistrationEkaIdsable)
    GetProfile()(ProfileResponseable)
    GetSkipState()(*CreateResponseType2_skip_state)
    GetSuccess()(*bool)
    SetEka(value RegistrationEkaIdsable)()
    SetProfile(value ProfileResponseable)()
    SetSkipState(value *CreateResponseType2_skip_state)()
    SetSuccess(value *bool)()
}
