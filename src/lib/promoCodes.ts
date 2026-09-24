// Teacher coupon codes and what each is worth (value × 10 coins).
//
// Server-only: this used to live in src/data.ts, which ships to every
// browser — any student could read every code in the page's JavaScript and,
// since redemptions weren't recorded, cash each one as many times as they
// liked. Redemption now happens in POST /api/user/claim, once per student.
export const PROMO_CODES: Record<string, number> = {
  "1N!C!0_HUM!LD3#": 1, "D0$_P@$0$_M@$!": 2, "TR3$_V3C3$_$U3RT3": 3, "CU@TR0_M@R@V!LL@$": 4, "C!NC0_CH0CL@L@$!": 5,
  "$3!$_$3NT!D0$!?": 6, "$!3T3_M@G!C0_777": 7, "0CH0_L0CUR@$_@B$0LUT@$": 8, "NU3V3_V!D@$_#9": 9, "D!3Z_P3RF3CT0$__X": 10,
  "0NC3_M@3$TR0$_#11": 11, "D0C3_M3$3$_G3N!@L3$": 12, "TR3C3_D3_$U3RT3!!": 13, "C@T0RC3_V!CT0R!@$!": 14, "QU!NC3_H3R03$_Y@!": 15,
  "D!3C!$$3!$_F@C!L!T0": 16, "D!3C!$!3T3_G3N!0$": 17, "D!3C!0CH0_0K_0K": 18, "D!3C!NU3V3_P0W3R#": 19, "V3!NT3_PUNT0$_PR0": 20,
  "V3!NT!UN0_W!N_W!N": 21, "V3!NT!D0$_P@$0$_!": 22, "V3!NT!TR3$_B!3N!!": 23, "V3!NT!CU@TR0_H0R@$": 24, "V3!NT!C!NC0_M!T@D%": 25,
  "V3!NT!$3!$_0R0_$$": 26, "V3!NT!$!3T3_T0P_!": 27, "V3!NT!0CH0_Y3$_Y3$": 28, "V3!NT!NU3V3_UP_UP": 29, "TR3!NT@_3P!C0$!M0": 30,
  "TR3!NT@Y1_M@X!M0#": 31, "TR3!NT@Y2_W0W_W0W": 32, "TR3!NT@Y3_PR0_M@X": 33, "TR3!NT@Y4_G0_G0_G0": 34, "TR3!NT@Y5_B3$T_!!": 35,
  "TR3!NT@Y6_F@$T_!!": 36, "TR3!NT@Y7_C00L_!!": 37, "TR3!NT@Y8_N!C3_!!": 38, "TR3!NT@Y9_$T@R_!!": 39, "CU@R3NT@_K!NG_!!": 40,
  "CU@R3NT@Y1_L3Y_!!": 41, "CU@R3NT@Y2_Z3N_!!": 42, "CU@R3NT@Y3_P!C0_!!": 43, "CU@R3NT@Y4_C!M@_!!": 44, "CU@R3NT@Y5_0MG_!!": 45,
  "CU@R3NT@Y6_FLY_!!": 46, "CU@R3NT@Y7_$KY_!!": 47, "CU@R3NT@Y8_M00N_!!": 48, "CU@R3NT@Y9_$UN_!!": 49, "C!NCU3NT@_L3Y3ND@$": 50,
  "C!NCU3NT@Y1_M@G!C": 51, "C!NCU3NT@Y2_R0CK$": 52, "C!NCU3NT@Y3_L3V3L": 53, "C!NCU3NT@Y4_B0$$!": 54, "C!NCU3NT@Y5_H@CK#": 55,
  "C!NCU3NT@Y6_F!R3$": 56, "C!NCU3NT@Y7_W!NW!": 57, "C!NCU3NT@Y8_M!ND%": 58, "C!NCU3NT@Y9_$0UL_": 59, "$3$3NT@_B00M_B00": 60,
  "$3$3NT@Y1_V!P_!!": 61, "$3$3NT@Y2_T0P_T0": 62, "$3$3NT@Y3_PR0_X!": 63, "$3$3NT@Y4_M@X_!!": 64, "$3$3NT@Y5_ULTR@": 65,
  "$3$3NT@Y6_H!P3R": 66, "$3$3NT@Y7_M3G@#": 67, "$3$3NT@Y8_0MG_!": 68, "$3$3NT@Y9_N!C3$": 69, "$3T3NT@_L3Y3ND@": 70,
  "$3T3NT@Y1_W0W_!": 71, "$3T3NT@Y2_Y3$_Y": 72, "$3T3NT@Y3_B3$T$": 73, "$3T3NT@Y4_C00L!": 74, "$3T3NT@Y5_F@$T_": 75,
  "$3T3NT@Y6_$T@R!": 76, "$3T3NT@Y7_K!NG_": 77, "$3T3NT@Y8_L3Y_!": 78, "$3T3NT@Y9_Z3N_!": 79, "0CH3NT@_P!C0_!!": 80,
  "0CH3NT@Y1_C!M@_": 81, "0CH3NT@Y2_0MG_!": 82, "0CH3NT@Y3_FLY_!": 83, "0CH3NT@Y4_$KY_!": 84, "0CH3NT@Y5_M00N$": 85,
  "0CH3NT@Y6_$UN_!": 86, "0CH3NT@Y7_G0LD%": 87, "0CH3NT@Y8_PL@T#": 88, "0CH3NT@Y9_D!@M@": 89, "N0V3NT@_M@$T3R!": 90,
  "N0V3NT@Y1_G0D_!": 91, "N0V3NT@Y2_3P!C$": 92, "N0V3NT@Y3_H3R0!": 93, "N0V3NT@Y4_T!T@N": 94, "N0V3NT@Y5_M!T0$": 95,
  "N0V3NT@Y6_R3Y_!": 96, "N0V3NT@Y7_J3F3$": 97, "N0V3NT@Y8_PR0_!": 98, "N0V3NT@Y9_99_!!": 99, "C!3N_P3RF3CT0_@@": 100
};
