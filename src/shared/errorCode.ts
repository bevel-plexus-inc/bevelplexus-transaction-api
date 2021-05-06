enum errorCodes {
    CorridorNotFound = "corridor_not_found",
    UserNotFound = "user_not_found",
    RecipientNotFound = "recipient_not_found",
    InstitutionNotFound = "institution_not_found",
    BankInfoNotFound = "bank_info_not_found",
    ConfigNotSetup = "config_not_setup",
    LowerThanMinimumSendAmount = "lower_than_minimum_send_amount",
    UserMissingVerificationData = "user_missing_verification_data",
    LevelConfigNotSetup = "level_config_not_setup",
    UserDailyLimitReached = "user_daily_limit_reached",
    SendAmountWithUserDailyLimitReached = "send_amount_with_user_daily_limit_reached",
    UserMonthlyLimitReached = "user_monthly_limit_reached",
    SendAmountWithUserMonthlyLimitReached = "send_amount_with_user_monthly_limit_reached",
    UserNotVerifiedCanOnlySendOnce = "user_not_verified_can_only_send_once",
    WrongIncomingDataRecipientIdNotPresent = "wrong_incoming_data_recipient_id_not_Present",
    WrongIncomingDataBankInfoIdNotPresent = "wrong_incoming_data_bank_info_id_not_Present",
    UserIsNotAStudent = "user_is_not_a_student",
    InstitutionDoesNotHaveBankInfo = "institution_does_not_have_bank_info",
    FXRateNotSetupForCorridor = "fx_rate_not_setup_for_corridor",
    CreateTransactionError = "create_transaction_error",
}

export default errorCodes;
