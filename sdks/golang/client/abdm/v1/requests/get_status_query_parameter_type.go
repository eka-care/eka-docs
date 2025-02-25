package requests
import (
    "errors"
)
// 
type GetStatusQueryParameterType int

const (
    REQUESTED_GETSTATUSQUERYPARAMETERTYPE GetStatusQueryParameterType = iota
    GRANTED_GETSTATUSQUERYPARAMETERTYPE
    EXPIRED_GETSTATUSQUERYPARAMETERTYPE
    DENIED_GETSTATUSQUERYPARAMETERTYPE
    REVOKED_GETSTATUSQUERYPARAMETERTYPE
)

func (i GetStatusQueryParameterType) String() string {
    return []string{"requested", "granted", "expired", "denied", "revoked"}[i]
}
func ParseGetStatusQueryParameterType(v string) (any, error) {
    result := REQUESTED_GETSTATUSQUERYPARAMETERTYPE
    switch v {
        case "requested":
            result = REQUESTED_GETSTATUSQUERYPARAMETERTYPE
        case "granted":
            result = GRANTED_GETSTATUSQUERYPARAMETERTYPE
        case "expired":
            result = EXPIRED_GETSTATUSQUERYPARAMETERTYPE
        case "denied":
            result = DENIED_GETSTATUSQUERYPARAMETERTYPE
        case "revoked":
            result = REVOKED_GETSTATUSQUERYPARAMETERTYPE
        default:
            return 0, errors.New("Unknown GetStatusQueryParameterType value: " + v)
    }
    return &result, nil
}
func SerializeGetStatusQueryParameterType(values []GetStatusQueryParameterType) []string {
    result := make([]string, len(values))
    for i, v := range values {
        result[i] = v.String()
    }
    return result
}
func (i GetStatusQueryParameterType) isMultiValue() bool {
    return false
}
