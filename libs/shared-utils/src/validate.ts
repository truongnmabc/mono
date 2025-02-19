import { EMAIL_REGEX } from "@shared-constants";

export const validateEmail = (email: string) => {
    if (email?.length == 0) {
        return false;
    }

    return EMAIL_REGEX.test(String(email).toLowerCase());
};
