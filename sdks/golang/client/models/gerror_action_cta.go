package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// GerrorActionCta 
type GerrorActionCta struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The params property
    params GerrorActionCta_paramsable
    // The pid property
    pid *string
    // The title property
    title *string
}
// NewGerrorActionCta instantiates a new GerrorActionCta and sets the default values.
func NewGerrorActionCta()(*GerrorActionCta) {
    m := &GerrorActionCta{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateGerrorActionCtaFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateGerrorActionCtaFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewGerrorActionCta(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *GerrorActionCta) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *GerrorActionCta) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["params"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetObjectValue(CreateGerrorActionCta_paramsFromDiscriminatorValue)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetParams(val.(GerrorActionCta_paramsable))
        }
        return nil
    }
    res["pid"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetPid(val)
        }
        return nil
    }
    res["title"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetTitle(val)
        }
        return nil
    }
    return res
}
// GetParams gets the params property value. The params property
func (m *GerrorActionCta) GetParams()(GerrorActionCta_paramsable) {
    return m.params
}
// GetPid gets the pid property value. The pid property
func (m *GerrorActionCta) GetPid()(*string) {
    return m.pid
}
// GetTitle gets the title property value. The title property
func (m *GerrorActionCta) GetTitle()(*string) {
    return m.title
}
// Serialize serializes information the current object
func (m *GerrorActionCta) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteObjectValue("params", m.GetParams())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("pid", m.GetPid())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("title", m.GetTitle())
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
func (m *GerrorActionCta) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetParams sets the params property value. The params property
func (m *GerrorActionCta) SetParams(value GerrorActionCta_paramsable)() {
    m.params = value
}
// SetPid sets the pid property value. The pid property
func (m *GerrorActionCta) SetPid(value *string)() {
    m.pid = value
}
// SetTitle sets the title property value. The title property
func (m *GerrorActionCta) SetTitle(value *string)() {
    m.title = value
}
// GerrorActionCtaable 
type GerrorActionCtaable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetParams()(GerrorActionCta_paramsable)
    GetPid()(*string)
    GetTitle()(*string)
    SetParams(value GerrorActionCta_paramsable)()
    SetPid(value *string)()
    SetTitle(value *string)()
}
