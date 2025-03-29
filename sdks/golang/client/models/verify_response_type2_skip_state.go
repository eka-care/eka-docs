package models
import (
    "errors"
)
// 
type VerifyResponseType2_skip_state int

const (
    ABHA_END_VERIFYRESPONSETYPE2_SKIP_STATE VerifyResponseType2_skip_state = iota
    CONFIRM_MOBILE_OTP_VERIFYRESPONSETYPE2_SKIP_STATE
    ABHA_SELECT_VERIFYRESPONSETYPE2_SKIP_STATE
    ABHA_CREATE_VERIFYRESPONSETYPE2_SKIP_STATE
)

func (i VerifyResponseType2_skip_state) String() string {
    return []string{"abha_end", "confirm_mobile_otp", "abha_select", "abha_create"}[i]
}
func ParseVerifyResponseType2_skip_state(v string) (any, error) {
    result := ABHA_END_VERIFYRESPONSETYPE2_SKIP_STATE
    switch v {
        case "abha_end":
            result = ABHA_END_VERIFYRESPONSETYPE2_SKIP_STATE
        case "confirm_mobile_otp":
            result = CONFIRM_MOBILE_OTP_VERIFYRESPONSETYPE2_SKIP_STATE
        case "abha_select":
            result = ABHA_SELECT_VERIFYRESPONSETYPE2_SKIP_STATE
        case "abha_create":
            result = ABHA_CREATE_VERIFYRESPONSETYPE2_SKIP_STATE
        default:
            return 0, errors.New("Unknown VerifyResponseType2_skip_state value: " + v)
    }
    return &result, nil
}
func SerializeVerifyResponseType2_skip_state(values []VerifyResponseType2_skip_state) []string {
    result := make([]string, len(values))
    for i, v := range values {
        result[i] = v.String()
    }
    return result
}
func (i VerifyResponseType2_skip_state) isMultiValue() bool {
    return false
}
