package models

import (
    i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e "time"
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// DetailsResponse 
type DetailsResponse struct {
    // The access_mode property
    access_mode *DetailsResponse_access_mode
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The created_at property
    created_at *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time
    // The duration property
    duration CommonsDurationable
    // The erase_at property
    erase_at *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time
    // The hiu property
    hiu CommonsHiuable
    // The id property
    id *string
    // The purpose property
    purpose CommonsPurposeable
    // The requester property
    requester CommonsRequesterable
    // The status property
    status *DetailsResponse_status
    // The updated_at property
    updated_at *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time
}
// NewDetailsResponse instantiates a new DetailsResponse and sets the default values.
func NewDetailsResponse()(*DetailsResponse) {
    m := &DetailsResponse{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateDetailsResponseFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateDetailsResponseFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewDetailsResponse(), nil
}
// GetAccessMode gets the access_mode property value. The access_mode property
func (m *DetailsResponse) GetAccessMode()(*DetailsResponse_access_mode) {
    return m.access_mode
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *DetailsResponse) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetCreatedAt gets the created_at property value. The created_at property
func (m *DetailsResponse) GetCreatedAt()(*i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time) {
    return m.created_at
}
// GetDuration gets the duration property value. The duration property
func (m *DetailsResponse) GetDuration()(CommonsDurationable) {
    return m.duration
}
// GetEraseAt gets the erase_at property value. The erase_at property
func (m *DetailsResponse) GetEraseAt()(*i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time) {
    return m.erase_at
}
// GetFieldDeserializers the deserialization information for the current model
func (m *DetailsResponse) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["access_mode"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetEnumValue(ParseDetailsResponse_access_mode)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetAccessMode(val.(*DetailsResponse_access_mode))
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
    res["duration"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetObjectValue(CreateCommonsDurationFromDiscriminatorValue)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetDuration(val.(CommonsDurationable))
        }
        return nil
    }
    res["erase_at"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetTimeValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetEraseAt(val)
        }
        return nil
    }
    res["hiu"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetObjectValue(CreateCommonsHiuFromDiscriminatorValue)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetHiu(val.(CommonsHiuable))
        }
        return nil
    }
    res["id"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetId(val)
        }
        return nil
    }
    res["purpose"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetObjectValue(CreateCommonsPurposeFromDiscriminatorValue)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetPurpose(val.(CommonsPurposeable))
        }
        return nil
    }
    res["requester"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetObjectValue(CreateCommonsRequesterFromDiscriminatorValue)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetRequester(val.(CommonsRequesterable))
        }
        return nil
    }
    res["status"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetEnumValue(ParseDetailsResponse_status)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetStatus(val.(*DetailsResponse_status))
        }
        return nil
    }
    res["updated_at"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetTimeValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetUpdatedAt(val)
        }
        return nil
    }
    return res
}
// GetHiu gets the hiu property value. The hiu property
func (m *DetailsResponse) GetHiu()(CommonsHiuable) {
    return m.hiu
}
// GetId gets the id property value. The id property
func (m *DetailsResponse) GetId()(*string) {
    return m.id
}
// GetPurpose gets the purpose property value. The purpose property
func (m *DetailsResponse) GetPurpose()(CommonsPurposeable) {
    return m.purpose
}
// GetRequester gets the requester property value. The requester property
func (m *DetailsResponse) GetRequester()(CommonsRequesterable) {
    return m.requester
}
// GetStatus gets the status property value. The status property
func (m *DetailsResponse) GetStatus()(*DetailsResponse_status) {
    return m.status
}
// GetUpdatedAt gets the updated_at property value. The updated_at property
func (m *DetailsResponse) GetUpdatedAt()(*i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time) {
    return m.updated_at
}
// Serialize serializes information the current object
func (m *DetailsResponse) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    if m.GetAccessMode() != nil {
        cast := (*m.GetAccessMode()).String()
        err := writer.WriteStringValue("access_mode", &cast)
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
        err := writer.WriteObjectValue("duration", m.GetDuration())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteTimeValue("erase_at", m.GetEraseAt())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteObjectValue("hiu", m.GetHiu())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("id", m.GetId())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteObjectValue("purpose", m.GetPurpose())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteObjectValue("requester", m.GetRequester())
        if err != nil {
            return err
        }
    }
    if m.GetStatus() != nil {
        cast := (*m.GetStatus()).String()
        err := writer.WriteStringValue("status", &cast)
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteTimeValue("updated_at", m.GetUpdatedAt())
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
// SetAccessMode sets the access_mode property value. The access_mode property
func (m *DetailsResponse) SetAccessMode(value *DetailsResponse_access_mode)() {
    m.access_mode = value
}
// SetAdditionalData sets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *DetailsResponse) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetCreatedAt sets the created_at property value. The created_at property
func (m *DetailsResponse) SetCreatedAt(value *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)() {
    m.created_at = value
}
// SetDuration sets the duration property value. The duration property
func (m *DetailsResponse) SetDuration(value CommonsDurationable)() {
    m.duration = value
}
// SetEraseAt sets the erase_at property value. The erase_at property
func (m *DetailsResponse) SetEraseAt(value *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)() {
    m.erase_at = value
}
// SetHiu sets the hiu property value. The hiu property
func (m *DetailsResponse) SetHiu(value CommonsHiuable)() {
    m.hiu = value
}
// SetId sets the id property value. The id property
func (m *DetailsResponse) SetId(value *string)() {
    m.id = value
}
// SetPurpose sets the purpose property value. The purpose property
func (m *DetailsResponse) SetPurpose(value CommonsPurposeable)() {
    m.purpose = value
}
// SetRequester sets the requester property value. The requester property
func (m *DetailsResponse) SetRequester(value CommonsRequesterable)() {
    m.requester = value
}
// SetStatus sets the status property value. The status property
func (m *DetailsResponse) SetStatus(value *DetailsResponse_status)() {
    m.status = value
}
// SetUpdatedAt sets the updated_at property value. The updated_at property
func (m *DetailsResponse) SetUpdatedAt(value *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)() {
    m.updated_at = value
}
// DetailsResponseable 
type DetailsResponseable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetAccessMode()(*DetailsResponse_access_mode)
    GetCreatedAt()(*i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)
    GetDuration()(CommonsDurationable)
    GetEraseAt()(*i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)
    GetHiu()(CommonsHiuable)
    GetId()(*string)
    GetPurpose()(CommonsPurposeable)
    GetRequester()(CommonsRequesterable)
    GetStatus()(*DetailsResponse_status)
    GetUpdatedAt()(*i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)
    SetAccessMode(value *DetailsResponse_access_mode)()
    SetCreatedAt(value *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)()
    SetDuration(value CommonsDurationable)()
    SetEraseAt(value *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)()
    SetHiu(value CommonsHiuable)()
    SetId(value *string)()
    SetPurpose(value CommonsPurposeable)()
    SetRequester(value CommonsRequesterable)()
    SetStatus(value *DetailsResponse_status)()
    SetUpdatedAt(value *i336074805fc853987abe6f7fe3ad97a6a6f3077a16391fec744f671a015fbd7e.Time)()
}
