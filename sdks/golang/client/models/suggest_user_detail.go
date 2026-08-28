package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// SuggestUserDetail 
type SuggestUserDetail struct {
    // Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
    additionalData map[string]any
    // The day_of_birth property
    day_of_birth *string
    // The first_name property
    first_name *string
    // The last_name property
    last_name *string
    // The month_of_birth property
    month_of_birth *string
    // The year_of_birth property
    year_of_birth *string
}
// NewSuggestUserDetail instantiates a new SuggestUserDetail and sets the default values.
func NewSuggestUserDetail()(*SuggestUserDetail) {
    m := &SuggestUserDetail{
    }
    m.SetAdditionalData(make(map[string]any))
    return m
}
// CreateSuggestUserDetailFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateSuggestUserDetailFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewSuggestUserDetail(), nil
}
// GetAdditionalData gets the AdditionalData property value. Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
func (m *SuggestUserDetail) GetAdditionalData()(map[string]any) {
    return m.additionalData
}
// GetDayOfBirth gets the day_of_birth property value. The day_of_birth property
func (m *SuggestUserDetail) GetDayOfBirth()(*string) {
    return m.day_of_birth
}
// GetFieldDeserializers the deserialization information for the current model
func (m *SuggestUserDetail) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := make(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error))
    res["day_of_birth"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetDayOfBirth(val)
        }
        return nil
    }
    res["first_name"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetFirstName(val)
        }
        return nil
    }
    res["last_name"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetLastName(val)
        }
        return nil
    }
    res["month_of_birth"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetMonthOfBirth(val)
        }
        return nil
    }
    res["year_of_birth"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetYearOfBirth(val)
        }
        return nil
    }
    return res
}
// GetFirstName gets the first_name property value. The first_name property
func (m *SuggestUserDetail) GetFirstName()(*string) {
    return m.first_name
}
// GetLastName gets the last_name property value. The last_name property
func (m *SuggestUserDetail) GetLastName()(*string) {
    return m.last_name
}
// GetMonthOfBirth gets the month_of_birth property value. The month_of_birth property
func (m *SuggestUserDetail) GetMonthOfBirth()(*string) {
    return m.month_of_birth
}
// GetYearOfBirth gets the year_of_birth property value. The year_of_birth property
func (m *SuggestUserDetail) GetYearOfBirth()(*string) {
    return m.year_of_birth
}
// Serialize serializes information the current object
func (m *SuggestUserDetail) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    {
        err := writer.WriteStringValue("day_of_birth", m.GetDayOfBirth())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("first_name", m.GetFirstName())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("last_name", m.GetLastName())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("month_of_birth", m.GetMonthOfBirth())
        if err != nil {
            return err
        }
    }
    {
        err := writer.WriteStringValue("year_of_birth", m.GetYearOfBirth())
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
func (m *SuggestUserDetail) SetAdditionalData(value map[string]any)() {
    m.additionalData = value
}
// SetDayOfBirth sets the day_of_birth property value. The day_of_birth property
func (m *SuggestUserDetail) SetDayOfBirth(value *string)() {
    m.day_of_birth = value
}
// SetFirstName sets the first_name property value. The first_name property
func (m *SuggestUserDetail) SetFirstName(value *string)() {
    m.first_name = value
}
// SetLastName sets the last_name property value. The last_name property
func (m *SuggestUserDetail) SetLastName(value *string)() {
    m.last_name = value
}
// SetMonthOfBirth sets the month_of_birth property value. The month_of_birth property
func (m *SuggestUserDetail) SetMonthOfBirth(value *string)() {
    m.month_of_birth = value
}
// SetYearOfBirth sets the year_of_birth property value. The year_of_birth property
func (m *SuggestUserDetail) SetYearOfBirth(value *string)() {
    m.year_of_birth = value
}
// SuggestUserDetailable 
type SuggestUserDetailable interface {
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.AdditionalDataHolder
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetDayOfBirth()(*string)
    GetFirstName()(*string)
    GetLastName()(*string)
    GetMonthOfBirth()(*string)
    GetYearOfBirth()(*string)
    SetDayOfBirth(value *string)()
    SetFirstName(value *string)()
    SetLastName(value *string)()
    SetMonthOfBirth(value *string)()
    SetYearOfBirth(value *string)()
}
