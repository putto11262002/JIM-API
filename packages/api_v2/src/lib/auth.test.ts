

import { hash, compare } from "./auth"
import {describe, it, expect} from "@jest/globals"


describe("compare", () => {
    it("should return true if password match the hash", async () => {
        const password = "password"
        const hashed = await hash(password)
        const result = await compare(password, hashed)
        expect(result).toBe(true)
    })

    it("should return false if password does not match the hash", async () => {
        const password = "password"
        const hashed = await hash(password)
        const result = await compare("wrongpassword", hashed)
        expect(result).toBe(false)
    })
})