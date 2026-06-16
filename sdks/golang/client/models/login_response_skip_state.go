package models
import (
    "errors"
)
// 
type LoginResponse_skip_state int

const (
    ABHA_END_LOGINRESPONSE_SKIP_STATE LoginResponse_skip_state = iota
    CONFIRM_MOBILE_OTP_LOGINRESPONSE_SKIP_STATE
    ABHA_SELECT_LOGINRESPONSE_SKIP_STATE
    ABHA_CREATE_LOGINRESPONSE_SKIP_STATE
)

func (i LoginResponse_skip_state) String() string {
    return []string{"abha_end", "confirm_mobile_otp", "abha_select", "abha_create"}[i]
}
func ParseLoginResponse_skip_state(v string) (any, error) {
    result := ABHA_END_LOGINRESPONSE_SKIP_STATE
    switch v {
        case "abha_end":
            result = ABHA_END_LOGINRESPONSE_SKIP_STATE
        case "confirm_mobile_otp":
            result = CONFIRM_MOBILE_OTP_LOGINRESPONSE_SKIP_STATE
        case "abha_select":
            result = ABHA_SELECT_LOGINRESPONSE_SKIP_STATE
        case "abha_create":
            result = ABHA_CREATE_LOGINRESPONSE_SKIP_STATE
        default:
            return 0, errors.New("Unknown LoginResponse_skip_state value: " + v)
    }
    return &result, nil
}
func SerializeLoginResponse_skip_state(values []LoginResponse_skip_state) []string {
    result := make([]string, len(values))
    for i, v := range values {
        result[i] = v.String()
    }
    return result
}
func (i LoginResponse_skip_state) isMultiValue() bool {
    return false
}
