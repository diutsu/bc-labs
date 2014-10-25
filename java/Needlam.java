
import java.io.BufferedReader;
import java.io.FileReader;

/**
 * 
 * *
 * */
public class Needlam {

	static int[][] scoreMx;

	public static void main(String[] argc) throws Exception {
		if (argc.length != 4) {
			System.out.println("Wrong argument number");
			System.out.println(argc.length);
			return;
		}

		String entradaX = new String();
		String entradaY = new String();
		int gap = Integer.parseInt(argc[2]);

		scoreMx = new int[20][20];
		
		
		entradaX = argc[0];
		entradaY = argc[1];
		
		int[][] alignMx = new int[entradaY.length() + 1][entradaX.length() + 1];
		int[][] btMx = new int[entradaY.length() + 1][entradaX.length() + 1];
		/* We have to read the matrix because */
		BufferedReader br = new BufferedReader(new FileReader(argc[3]));
		try {
			String line = br.readLine();
			int j = 0;
			int i = 0;
			while (line != null) {
				j = 0;
				String[] lineValues = line.split(" ");
				for (String s : lineValues) {
					scoreMx[i][j] = Integer.parseInt(s);
					j++;
				}
				line = br.readLine();
				i++;
			}
		} finally {
			br.close();
		}
		
		/* INIT */
		alignMx[0][0] = 0;
		for (int i = 1; i < entradaY.length() + 1; i++) {
			alignMx[i][0] = alignMx[i - 1][0] - gap;
			btMx[i][0] = 2;
		}

		for (int j = 1; j < entradaX.length() + 1; j++) {
			alignMx[0][j] = alignMx[0][j - 1] - gap;
			btMx[0][j] = 1;
		}

		/* Fill the matrix with the values and also the backtrace */
		for (int i = 1; i < entradaY.length() + 1; i++) {
			for (int j = 1; j < entradaX.length() + 1; j++) {
				int up = alignMx[i - 1][j] - gap;
				int left = alignMx[i][j - 1] - gap;
				int diag = alignMx[i - 1][j - 1]
						+ getScore(entradaY.charAt(i - 1),
								entradaX.charAt(j - 1));
				if (diag >= left && diag >= up) {
					alignMx[i][j] = diag;
					btMx[i][j] = 0;
				} else if (left > up) {
					alignMx[i][j] = left;
					btMx[i][j] = 1;
				} else {
					alignMx[i][j] = up;
					btMx[i][j] = 2;
				}

			}
		}
		/* TESTS ONLY */

//		for (int i = 0; i < entradaY.length() + 1; i++) {
//			for (int j = 0; j < entradaX.length() + 1; j++) {
//				System.out.print("\t" + alignMx[i][j] + "|" + btMx[i][j]);
//			}
//			System.out.println();
//		}

		/* Follow Backtraces */
		String a1 = new String();
		String a2 = new String();
		int i = entradaY.length();
		int j = entradaX.length();
		while (i > 0 || j > 0) {
			if (btMx[i][j] == 0) {
				a1 += entradaX.charAt(--j);
				a2 += entradaY.charAt(--i);
			} else if (btMx[i][j] == 1) {
				a1 += entradaX.charAt(--j);
				a2 += '-';
			} else {
				a1 += '-';
				a2 += entradaY.charAt(--i);
			}
		}

		System.out.println("Optimal aligment score: "
				+ alignMx[entradaY.length()][entradaX.length()]);
		System.out.println("Global aligment: ");
		System.out.println((new StringBuilder(a1)).reverse());
		System.out.println((new StringBuilder(a2)).reverse());
		return;
	}

	private static int getScore(char charAt, char charAt2) throws Exception {
		return scoreMx[getIndex(charAt)][getIndex(charAt2)];
	}

	private static int getIndex(char charAt) throws Exception {
		switch (charAt) {
		case 'A':
			return 0;
		case 'R':
			return 1;
		case 'N':
			return 2;
		case 'D':
			return 3;
		case 'C':
			return 4;
		case 'Q':
			return 5;
		case 'E':
			return 6;
		case 'G':
			return 7;
		case 'H':
			return 8;
		case 'I':
			return 9;
		case 'L':
			return 10;
		case 'K':
			return 11;
		case 'M':
			return 12;
		case 'F':
			return 13;
		case 'P':
			return 14;
		case 'S':
			return 15;
		case 'T':
			return 16;
		case 'W':
			return 17;
		case 'Y':
			return 18;
		case 'V':
			return 19;
		default:
			throw new Exception("Invalid letter detected: " + charAt);
		}
	}

}
