package models
import (
    "errors"
)
// 
type DetailsResponse_status int

const (
    REQUESTED_DETAILSRESPONSE_STATUS DetailsResponse_status = iota
    GRANTED_DETAILSRESPONSE_STATUS
    EXPIRED_DETAILSRESPONSE_STATUS
    DENIED_DETAILSRESPONSE_STATUS
    REVOKED_DETAILSRESPONSE_STATUS
)

func (i DetailsResponse_status) String() string {
    return []string{"requested", "granted", "expired", "denied", "revoked"}[i]
}
func ParseDetailsResponse_status(v string) (any, error) {
    result := REQUESTED_DETAILSRESPONSE_STATUS
    switch v {
        case "requested":
            result = REQUESTED_DETAILSRESPONSE_STATUS
        case "granted":
            result = GRANTED_DETAILSRESPONSE_STATUS
        case "expired":
            result = EXPIRED_DETAILSRESPONSE_STATUS
        case "denied":
            result = DENIED_DETAILSRESPONSE_STATUS
        case "revoked":
            result = REVOKED_DETAILSRESPONSE_STATUS
        default:
            return 0, errors.New("Unknown DetailsResponse_status value: " + v)
    }
    return &result, nil
}
func SerializeDetailsResponse_status(values []DetailsResponse_status) []string {
    result := make([]string, len(values))
    for i, v := range values {
        result[i] = v.String()
    }
    return result
}
func (i DetailsResponse_status) isMultiValue() bool {
    return false
}
