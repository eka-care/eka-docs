package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// GerrorAction 
type GerrorAction struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The cta property
    cta GerrorActionCtaable
    // The description property
    description *string
    // The img property
    img *string
    // The suggest_method property
    suggest_method *string
    // The title property
    title *string
}
// NewGerrorAction instantiates a new GerrorAction and sets the default values.
func NewGerrorAction()(*GerrorAction) {
    m := &GerrorAction{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateGerrorActionFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateGerrorActionFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewGerrorAction(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *GerrorAction) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetCta gets the cta property value. The cta property
func (m *GerrorAction) GetCta()(GerrorActionCtaable) {
    return m.cta
}
// GetDescription gets the description property value. The description property
func (m *GerrorAction) GetDescription()(*string) {
    return m.description
}
// GetFieldDeserializers the deserialization information for the current model
func (m *GerrorAction) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["cta"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetObjectValue(CreateGerrorActionCtaFromDiscriminatorValue)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetCta(val.(GerrorActionCtaable))
        }
        return nil
    }
    res["description"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetDescription(val)
        }
        return nil
    }
    res["img"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetImg(val)
        }
        return nil
    }
    res["suggest_method"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetSuggestMethod(val)
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
// GetImg gets the img property value. The img property
func (m *GerrorAction) GetImg()(*string) {
    return m.img
}
// GetSuggestMethod gets the suggest_method property value. The suggest_method property
func (m *GerrorAction) GetSuggestMethod()(*string) {
    return m.suggest_method
}
// GetTitle gets the title property value. The title property
func (m *GerrorAction) GetTitle()(*string) {
    return m.title
}
// Serialize serializes information the current object
func (m *GerrorAction) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteObjectValue("cta", m.GetCta())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("description", m.GetDescription())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("img", m.GetImg())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("suggest_method", m.GetSuggestMethod())
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
func (m *GerrorAction) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetCta sets the cta property value. The cta property
func (m *GerrorAction) SetCta(value GerrorActionCtaable)() {
    m.cta = value
}
// SetDescription sets the description property value. The description property
func (m *GerrorAction) SetDescription(value *string)() {
    m.description = value
}
// SetImg sets the img property value. The img property
func (m *GerrorAction) SetImg(value *string)() {
    m.img = value
}
// SetSuggestMethod sets the suggest_method property value. The suggest_method property
func (m *GerrorAction) SetSuggestMethod(value *string)() {
    m.suggest_method = value
}
// SetTitle sets the title property value. The title property
func (m *GerrorAction) SetTitle(value *string)() {
    m.title = value
}
// GerrorActionable 
type GerrorActionable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetCta()(GerrorActionCtaable)
    GetDescription()(*string)
    GetImg()(*string)
    GetSuggestMethod()(*string)
    GetTitle()(*string)
    SetCta(value GerrorActionCtaable)()
    SetDescription(value *string)()
    SetImg(value *string)()
    SetSuggestMethod(value *string)()
    SetTitle(value *string)()
}
