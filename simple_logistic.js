function sumCoeffs(c) {
	return 0.09 + c[1] * 0.11 + c[2] * -0.15 + c[5] * -0.2 + c[7] * -0.07 + c[9] * -0.28 + c[11] * -0.08 + c[12] * -0.17 + c[13] * -0.08 + c[14] * -0.24 + c[16] * -0.24 + c[18] * 0.11 + c[21] * -0.18 + c[22] * 0.15 + c[23] * 0.08 + c[24] * -0.07 + c[25] * 0.12 + c[26] * 0.09 + c[27] * 0.27 + c[28] * -0.04 + c[29] * -0.14 + c[30] * -0.2 + c[31] * -0.11 + c[33] * 0.07 + c[37] * -0.08 + c[38] * 0.12 + c[39] * 0.05 + c[40] * -0.12 + c[41] * -0.23 + c[43] * 0.12 + c[44] * -0.16 + c[48] * -0.12 + c[50] * -0.15 + c[51] * -0.17 + c[52] * -0.09 + c[53] * -0.11 + c[54] * -0.09 + c[55] * 0.04 + c[56] * -0.03 + c[57] * 0.04 + c[58] * 0.15 + c[59] * 0.11 + c[60] * 0.06 + c[61] * -0.14 + c[62] * 0.19 + c[64] * 0.07 + c[66] * -0.05 + c[70] * -0.14 + c[71] * -0.1 + c[73] * -0.21 + c[74] * 0.05 + c[75] * -0.06 + c[77] * -0.15 + c[79] * -0.12 + c[80] * -0.04 + c[81] * 0.12 + c[82] * -0.13 + c[84] * 0.07 + c[87] * -0.13 + c[88] * -0.11 + c[91] * 0.41 + c[92] * 0.07 + c[93] * -0.04 + c[94] * -0.07 + c[97] * -0.06 + c[98] * -0.29 + c[99] * -0.2 + c[100] * -0.13 + c[103] * -0.2 + c[107] * -0.12 + c[108] * -0.05 + c[109] * -0.17 + c[114] * -0.09 + c[115] * -0.11 + c[116] * 0.05 + c[117] * -0.26 + c[119] * -0.13 + c[120] * 0.11 + c[121] * -0.08 + c[122] * -0.2 + c[123] * 0.07 + c[1+124] * -0.11 + c[2+124] * 0.16 + c[3+124] * -0.07 + c[5+124] * 0.33 + c[7+124] * 0.05 + c[8+124] * 0.07 + c[9+124] * 0.34 + c[10+124] * 0.03 + c[11+124] * 0.1  + c[12+124] * 0.2  + c[14+124] * 0.2  + c[16+124] * 0.19 + c[18+124] * -0.11 + c[20+124] * -0.08 + c[21+124] * 0.14 + c[22+124] * -0.14 + c[23+124] * -0.07 + c[24+124] * 0.09 + c[25+124] * -0.12 + c[26+124] * -0.09 + c[27+124] * -0.27 + c[29+124] * 0.17 + c[30+124] * 0.19 + c[31+124] * 0.12 + c[33+124] * -0.06 + c[38+124] * -0.15 + c[39+124] * -0.07 + c[40+124] * 0.1  + c[41+124] * 0.23 + c[43+124] * -0.13 + c[44+124] * 0.18 + c[46+124] * -0.09 + c[47+124] * -0.09 + c[48+124] * 0.09 + c[50+124] * 0.17 + c[51+124] * 0.19 + c[56+124] * 0.04 + c[57+124] * -0.05 + c[58+124] * -0.17 + c[59+124] * -0.08 + c[60+124] * -0.04 + c[61+124] * 0.1  + c[62+124] * -0.18 + c[64+124] * -0.07 + c[65+124] * -0.14 + c[70+124] * 0.15 + c[71+124] * 0.1  + c[72+124] * -0.09 + c[73+124] * 0.11 + c[74+124] * -0.08 + c[75+124] * 0.06 + c[77+124] * 0.14 + c[79+124] * 0.09 + c[84+124] * -0.11 + c[85+124] * -0.06 + c[86+124] * 0.22 + c[87+124] * 0.1  + c[88+124] * 0.12 + c[91+124] * -0.42 + c[92+124] * -0.09 + c[96+124] * 0.13 + c[97+124] * 0.04 + c[98+124] * 0.33 + c[99+124] * 0.24 + c[100+124] * 0.12 + c[101+124] * -0.05 + c[103+124] * 0.23 + c[107+124] * 0.13 + c[108+124] * 0.07 + c[109+124] * 0.06 + c[112+124] * -0.05 + c[113+124] * 0.09 + c[115+124] * 0.14 + c[116+124] * -0.11 + c[117+124] * 0.19 + c[119+124] * 0.14 + c[120+124] * -0.13 + c[121+124] * 0.06 + c[122+124] * 0.24;
}

exports.getProbability = function(v) {
	if (v.length != 10) return 0;
	
	vector1 = [];
	vector2 = [];

	// inicializar vectores a 0
	for (var i = 0; i < 248; ++i) {
		vector1.push(0);
		vector2.push(0);
	}

	for (var i = 0; i < 5; ++i) {
		vector1[v[i]] = 1;
		vector1[124 + v[i+5]] = 1;

		vector2[124 + v[i]] = 1;
		vector2[v[i+5]] = 1;
	}

	sc1 = sumCoeffs(vector1);
	sc2 = sumCoeffs(vector2);

	pr1 = 1/(1+Math.exp(-sc1));
	pr2 = 1/(1+Math.exp(-sc2));

	prAvg = (pr1 + (1-pr2)) / 2;

	return prAvg;
}