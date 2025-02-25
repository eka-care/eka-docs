package models

import (
    i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e "time"
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// HipQRScanShareProfileResponseV2 
type HipQRScanShareProfileResponseV2 struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The address property
    address *string
    // The created_at property
    created_at *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time
    // The footer property
    footer *string
    // The hip_id property
    hip_id *string
    // The hip_name property
    hip_name *string
    // The request_id property
    request_id *string
    // The show_token_screen property
    show_token_screen *bool
    // The token_expiry property
    token_expiry *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time
    // The token_number property
    token_number *string
}
// NewHipQRScanShareProfileResponseV2 instantiates a new HipQRScanShareProfileResponseV2 and sets the default values.
func NewHipQRScanShareProfileResponseV2()(*HipQRScanShareProfileResponseV2) {
    m := &HipQRScanShareProfileResponseV2{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateHipQRScanShareProfileResponseV2FromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateHipQRScanShareProfileResponseV2FromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewHipQRScanShareProfileResponseV2(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *HipQRScanShareProfileResponseV2) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetAddress gets the address property value. The address property
func (m *HipQRScanShareProfileResponseV2) GetAddress()(*string) {
    return m.address
}
// GetCreatedAt gets the created_at property value. The created_at property
func (m *HipQRScanShareProfileResponseV2) GetCreatedAt()(*i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time) {
    return m.created_at
}
// GetFieldDeserializers the deserialization information for the current model
func (m *HipQRScanShareProfileResponseV2) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["address"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetAddress(val)
        }
        return nil
    }
    res["created_at"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetTimeValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetCreatedAt(val)
        }
        return nil
    }
    res["footer"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetFooter(val)
        }
        return nil
    }
    res["hip_id"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetHipId(val)
        }
        return nil
    }
    res["hip_name"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetHipName(val)
        }
        return nil
    }
    res["request_id"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetRequestId(val)
        }
        return nil
    }
    res["show_token_screen"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetBoolValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetShowTokenScreen(val)
        }
        return nil
    }
    res["token_expiry"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetTimeValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetTokenExpiry(val)
        }
        return nil
    }
    res["token_number"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetTokenNumber(val)
        }
        return nil
    }
    return res
}
// GetFooter gets the footer property value. The footer property
func (m *HipQRScanShareProfileResponseV2) GetFooter()(*string) {
    return m.footer
}
// GetHipId gets the hip_id property value. The hip_id property
func (m *HipQRScanShareProfileResponseV2) GetHipId()(*string) {
    return m.hip_id
}
// GetHipName gets the hip_name property value. The hip_name property
func (m *HipQRScanShareProfileResponseV2) GetHipName()(*string) {
    return m.hip_name
}
// GetRequestId gets the request_id property value. The request_id property
func (m *HipQRScanShareProfileResponseV2) GetRequestId()(*string) {
    return m.request_id
}
// GetShowTokenScreen gets the show_token_screen property value. The show_token_screen property
func (m *HipQRScanShareProfileResponseV2) GetShowTokenScreen()(*bool) {
    return m.show_token_screen
}
// GetTokenExpiry gets the token_expiry property value. The token_expiry property
func (m *HipQRScanShareProfileResponseV2) GetTokenExpiry()(*i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time) {
    return m.token_expiry
}
// GetTokenNumber gets the token_number property value. The token_number property
func (m *HipQRScanShareProfileResponseV2) GetTokenNumber()(*string) {
    return m.token_number
}
// Serialize serializes information the current object
func (m *HipQRScanShareProfileResponseV2) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("address", m.GetAddress())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteTimeValue("created_at", m.GetCreatedAt())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("footer", m.GetFooter())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("hip_id", m.GetHipId())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("hip_name", m.GetHipName())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("request_id", m.GetRequestId())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteBoolValue("show_token_screen", m.GetShowTokenScreen())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteTimeValue("token_expiry", m.GetTokenExpiry())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("token_number", m.GetTokenNumber())
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
func (m *HipQRScanShareProfileResponseV2) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetAddress sets the address property value. The address property
func (m *HipQRScanShareProfileResponseV2) SetAddress(value *string)() {
    m.address = value
}
// SetCreatedAt sets the created_at property value. The created_at property
func (m *HipQRScanShareProfileResponseV2) SetCreatedAt(value *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)() {
    m.created_at = value
}
// SetFooter sets the footer property value. The footer property
func (m *HipQRScanShareProfileResponseV2) SetFooter(value *string)() {
    m.footer = value
}
// SetHipId sets the hip_id property value. The hip_id property
func (m *HipQRScanShareProfileResponseV2) SetHipId(value *string)() {
    m.hip_id = value
}
// SetHipName sets the hip_name property value. The hip_name property
func (m *HipQRScanShareProfileResponseV2) SetHipName(value *string)() {
    m.hip_name = value
}
// SetRequestId sets the request_id property value. The request_id property
func (m *HipQRScanShareProfileResponseV2) SetRequestId(value *string)() {
    m.request_id = value
}
// SetShowTokenScreen sets the show_token_screen property value. The show_token_screen property
func (m *HipQRScanShareProfileResponseV2) SetShowTokenScreen(value *bool)() {
    m.show_token_screen = value
}
// SetTokenExpiry sets the token_expiry property value. The token_expiry property
func (m *HipQRScanShareProfileResponseV2) SetTokenExpiry(value *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)() {
    m.token_expiry = value
}
// SetTokenNumber sets the token_number property value. The token_number property
func (m *HipQRScanShareProfileResponseV2) SetTokenNumber(value *string)() {
    m.token_number = value
}
// HipQRScanShareProfileResponseV2able 
type HipQRScanShareProfileResponseV2able interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetAddress()(*string)
    GetCreatedAt()(*i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)
    GetFooter()(*string)
    GetHipId()(*string)
    GetHipName()(*string)
    GetRequestId()(*string)
    GetShowTokenScreen()(*bool)
    GetTokenExpiry()(*i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)
    GetTokenNumber()(*string)
    SetAddress(value *string)()
    SetCreatedAt(value *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)()
    SetFooter(value *string)()
    SetHipId(value *string)()
    SetHipName(value *string)()
    SetRequestId(value *string)()
    SetShowTokenScreen(value *bool)()
    SetTokenExpiry(value *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)()
    SetTokenNumber(value *string)()
}
