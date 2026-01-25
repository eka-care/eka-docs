package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// SuggestRequest 
type SuggestRequest struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The flow property
    flow *SuggestRequest_flow
    // Transaction ID received in /init api
    txn_id *string
    // The user_detail property
    user_detail SuggestUserDetailable
}
// NewSuggestRequest instantiates a new SuggestRequest and sets the default values.
func NewSuggestRequest()(*SuggestRequest) {
    m := &SuggestRequest{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateSuggestRequestFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateSuggestRequestFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewSuggestRequest(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *SuggestRequest) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetFieldDeserializers the deserialization information for the current model
func (m *SuggestRequest) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["flow"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetEnumValue(ParseSuggestRequest_flow)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetFlow(val.(*SuggestRequest_flow))
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
    res["user_detail"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetObjectValue(CreateSuggestUserDetailFromDiscriminatorValue)
        if err != nil {
            return err
        }
        if val != nil {
            m.SetUserDetail(val.(SuggestUserDetailable))
        }
        return nil
    }
    return res
}
// GetFlow gets the flow property value. The flow property
func (m *SuggestRequest) GetFlow()(*SuggestRequest_flow) {
    return m.flow
}
// GetTxnId gets the txn_id property value. Transaction ID received in /init api
func (m *SuggestRequest) GetTxnId()(*string) {
    return m.txn_id
}
// GetUserDetail gets the user_detail property value. The user_detail property
func (m *SuggestRequest) GetUserDetail()(SuggestUserDetailable) {
    return m.user_detail
}
// Serialize serializes information the current object
func (m *SuggestRequest) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    if m.GetFlow() != nil {
        cast := (*m.GetFlow()).String()
        err := writer.WriteStringValue("flow", &cast)
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
        err := writer.WriteObjectValue("user_detail", m.GetUserDetail())
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
func (m *SuggestRequest) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetFlow sets the flow property value. The flow property
func (m *SuggestRequest) SetFlow(value *SuggestRequest_flow)() {
    m.flow = value
}
// SetTxnId sets the txn_id property value. Transaction ID received in /init api
func (m *SuggestRequest) SetTxnId(value *string)() {
    m.txn_id = value
}
// SetUserDetail sets the user_detail property value. The user_detail property
func (m *SuggestRequest) SetUserDetail(value SuggestUserDetailable)() {
    m.user_detail = value
}
// SuggestRequestable 
type SuggestRequestable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetFlow()(*SuggestRequest_flow)
    GetTxnId()(*string)
    GetUserDetail()(SuggestUserDetailable)
    SetFlow(value *SuggestRequest_flow)()
    SetTxnId(value *string)()
    SetUserDetail(value SuggestUserDetailable)()
}
