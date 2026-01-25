package models
import (
    "errors"
)
// 
type SuggestRequest_flow int

const (
    AADHAAR_SUGGESTREQUEST_FLOW SuggestRequest_flow = iota
    MOBILE_SUGGESTREQUEST_FLOW
)

func (i SuggestRequest_flow) String() string {
    return []string{"aadhaar", "mobile"}[i]
}
func ParseSuggestRequest_flow(v string) (any, error) {
    result := AADHAAR_SUGGESTREQUEST_FLOW
    switch v {
        case "aadhaar":
            result = AADHAAR_SUGGESTREQUEST_FLOW
        case "mobile":
            result = MOBILE_SUGGESTREQUEST_FLOW
        default:
            return 0, errors.New("Unknown SuggestRequest_flow value: " + v)
    }
    return &result, nil
}
func SerializeSuggestRequest_flow(values []SuggestRequest_flow) []string {
    result := make([]string, len(values))
    for i, v := range values {
        result[i] = v.String()
    }
    return result
}
func (i SuggestRequest_flow) isMultiValue() bool {
    return false
}
