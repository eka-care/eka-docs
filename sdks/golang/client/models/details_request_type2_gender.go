package models
import (
    "errors"
)
// 
type DetailsRequestType2_gender int

const (
    M_DETAILSREQUESTTYPE2_GENDER DetailsRequestType2_gender = iota
    F_DETAILSREQUESTTYPE2_GENDER
    O_DETAILSREQUESTTYPE2_GENDER
)

func (i DetailsRequestType2_gender) String() string {
    return []string{"M", "F", "O"}[i]
}
func ParseDetailsRequestType2_gender(v string) (any, error) {
    result := M_DETAILSREQUESTTYPE2_GENDER
    switch v {
        case "M":
            result = M_DETAILSREQUESTTYPE2_GENDER
        case "F":
            result = F_DETAILSREQUESTTYPE2_GENDER
        case "O":
            result = O_DETAILSREQUESTTYPE2_GENDER
        default:
            return 0, errors.New("Unknown DetailsRequestType2_gender value: " + v)
    }
    return &result, nil
}
func SerializeDetailsRequestType2_gender(values []DetailsRequestType2_gender) []string {
    result := make([]string, len(values))
    for i, v := range values {
        result[i] = v.String()
    }
    return result
}
func (i DetailsRequestType2_gender) isMultiValue() bool {
    return false
}
