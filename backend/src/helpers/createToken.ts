import { randomBytes } from "crypto";

export function createToken(length = 24) {
    return randomBytes(Math.round(length / 2)).toString("hex");
}
