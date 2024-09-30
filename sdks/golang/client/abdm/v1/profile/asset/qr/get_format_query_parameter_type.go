package qr
import (
    "errors"
)
// 
type GetFormatQueryParameterType int

const (
    JSON_GETFORMATQUERYPARAMETERTYPE GetFormatQueryParameterType = iota
)

func (i GetFormatQueryParameterType) String() string {
    return []string{"json"}[i]
}
func ParseGetFormatQueryParameterType(v string) (any, error) {
    result := JSON_GETFORMATQUERYPARAMETERTYPE
    switch v {
        case "json":
            result = JSON_GETFORMATQUERYPARAMETERTYPE
        default:
            return 0, errors.New("Unknown GetFormatQueryParameterType value: " + v)
    }
    return &result, nil
}
func SerializeGetFormatQueryParameterType(values []GetFormatQueryParameterType) []string {
    result := make([]string, len(values))
    for i, v := range values {
        result[i] = v.String()
    }
    return result
}
func (i GetFormatQueryParameterType) isMultiValue() bool {
    return false
}
