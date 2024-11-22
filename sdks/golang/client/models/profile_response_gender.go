package models
import (
    "errors"
)
// 
type ProfileResponse_gender int

const (
    M_PROFILERESPONSE_GENDER ProfileResponse_gender = iota
    F_PROFILERESPONSE_GENDER
    O_PROFILERESPONSE_GENDER
)

func (i ProfileResponse_gender) String() string {
    return []string{"M", "F", "O"}[i]
}
func ParseProfileResponse_gender(v string) (any, error) {
    result := M_PROFILERESPONSE_GENDER
    switch v {
        case "M":
            result = M_PROFILERESPONSE_GENDER
        case "F":
            result = F_PROFILERESPONSE_GENDER
        case "O":
            result = O_PROFILERESPONSE_GENDER
        default:
            return 0, errors.New("Unknown ProfileResponse_gender value: " + v)
    }
    return &result, nil
}
func SerializeProfileResponse_gender(values []ProfileResponse_gender) []string {
    result := make([]string, len(values))
    for i, v := range values {
        result[i] = v.String()
    }
    return result
}
func (i ProfileResponse_gender) isMultiValue() bool {
    return false
}
