package requests
import (
    "errors"
)
// 
type GetTypeQueryParameterType int

const (
    CONSENT_GETTYPEQUERYPARAMETERTYPE GetTypeQueryParameterType = iota
    SUBSCRIPTION_GETTYPEQUERYPARAMETERTYPE
    AUTHORIZATION_GETTYPEQUERYPARAMETERTYPE
    ALL_GETTYPEQUERYPARAMETERTYPE
)

func (i GetTypeQueryParameterType) String() string {
    return []string{"consent", "subscription", "authorization", "all"}[i]
}
func ParseGetTypeQueryParameterType(v string) (any, error) {
    result := CONSENT_GETTYPEQUERYPARAMETERTYPE
    switch v {
        case "consent":
            result = CONSENT_GETTYPEQUERYPARAMETERTYPE
        case "subscription":
            result = SUBSCRIPTION_GETTYPEQUERYPARAMETERTYPE
        case "authorization":
            result = AUTHORIZATION_GETTYPEQUERYPARAMETERTYPE
        case "all":
            result = ALL_GETTYPEQUERYPARAMETERTYPE
        default:
            return 0, errors.New("Unknown GetTypeQueryParameterType value: " + v)
    }
    return &result, nil
}
func SerializeGetTypeQueryParameterType(values []GetTypeQueryParameterType) []string {
    result := make([]string, len(values))
    for i, v := range values {
        result[i] = v.String()
    }
    return result
}
func (i GetTypeQueryParameterType) isMultiValue() bool {
    return false
}
