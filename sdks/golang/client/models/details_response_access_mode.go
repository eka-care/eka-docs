package models
import (
    "errors"
)
// 
type DetailsResponse_access_mode int

const (
    VIEW_DETAILSRESPONSE_ACCESS_MODE DetailsResponse_access_mode = iota
)

func (i DetailsResponse_access_mode) String() string {
    return []string{"view"}[i]
}
func ParseDetailsResponse_access_mode(v string) (any, error) {
    result := VIEW_DETAILSRESPONSE_ACCESS_MODE
    switch v {
        case "view":
            result = VIEW_DETAILSRESPONSE_ACCESS_MODE
        default:
            return 0, errors.New("Unknown DetailsResponse_access_mode value: " + v)
    }
    return &result, nil
}
func SerializeDetailsResponse_access_mode(values []DetailsResponse_access_mode) []string {
    result := make([]string, len(values))
    for i, v := range values {
        result[i] = v.String()
    }
    return result
}
func (i DetailsResponse_access_mode) isMultiValue() bool {
    return false
}
