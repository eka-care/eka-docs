package models

import (
    i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// GerrorErrorResp 
type GerrorErrorResp struct {
    i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ApiError
    // The action property
    action GerrorActionable
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The code property
    code *int32
    // The error property
    errorEscaped *string
}
// NewGerrorErrorResp instantiates a new GerrorErrorResp and sets the default values.
func NewGerrorErrorResp()(*GerrorErrorResp) {
    m := &GerrorErrorResp{
        ApiError: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewApiError(),
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateGerrorErrorRespFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateGerrorErrorRespFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewGerrorErrorResp(), nil
}
// Error the primary error message.
func (m *GerrorErrorResp) Error()(string) {
    return m.ApiError.Error()
}
// GetAction gets the action property value. The action property
func (m *GerrorErrorResp) GetAction()(GerrorActionable) {
    return m.action
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *GerrorErrorResp) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetCode gets the code property value. The code property
func (m *GerrorErrorResp) GetCode()(*int32) {
    return m.code
}
// GetErrorEscaped gets the error property value. The error property
func (m *GerrorErrorResp) GetErrorEscaped()(*string) {
    return m.errorEscaped
}
// GetFieldDeserializers the deserialization information for the current model
func (m *GerrorErrorResp) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["action"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetObjectValue(CreateGerrorActionFromDiscriminatorValue)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetAction(val.(GerrorActionable))
        }
        return nil
    }
    res["code"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetInt32Value()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetCode(val)
        }
        return nil
    }
    res["error"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetErrorEscaped(val)
        }
        return nil
    }
    return res
}
// Serialize serializes information the current object
func (m *GerrorErrorResp) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteObjectValue("action", m.GetAction())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteInt32Value("code", m.GetCode())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("error", m.GetErrorEscaped())
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
// SetAction sets the action property value. The action property
func (m *GerrorErrorResp) SetAction(value GerrorActionable)() {
    m.action = value
}
// SetAdditionalData sets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *GerrorErrorResp) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetCode sets the code property value. The code property
func (m *GerrorErrorResp) SetCode(value *int32)() {
    m.code = value
}
// SetErrorEscaped sets the error property value. The error property
func (m *GerrorErrorResp) SetErrorEscaped(value *string)() {
    m.errorEscaped = value
}
// GerrorErrorRespable 
type GerrorErrorRespable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetAction()(GerrorActionable)
    GetCode()(*int32)
    GetErrorEscaped()(*string)
    SetAction(value GerrorActionable)()
    SetCode(value *int32)()
    SetErrorEscaped(value *string)()
}
