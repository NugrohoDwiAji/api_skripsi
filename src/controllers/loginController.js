import { db } from "../dbConennection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {response} from "../components/response.js";

// ROT13

function rot13(text) {
  return text.replace(/[a-zA-Z]/g, function (char) {
    let base = char <= "Z" ? 65 : 97; // 65 untuk 'A' dan 97 untuk 'a'
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

// Fungsi untuk menghitung invers dari a di modulo m
function modInverse(a, m) {
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  throw new Error("No modular inverse found");
}

// Fungsi Decript Affine Cipher
export const AffineCipherde = async (data, a, b) => {
  const text = rot13(data);
  let decryptedText = "";
  let aInverse = modInverse(a, 26); // Mencari invers dari a
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (char.match(/[a-z]/i)) {
      let charCode = text.charCodeAt(i);
      let isUpperCase = charCode >= 65 && charCode <= 90;
      let base = isUpperCase ? 65 : 97;

      let decryptedCharCode =
        ((aInverse * (charCode - base - b + 26)) % 26) + base;
      decryptedText += String.fromCharCode(decryptedCharCode);
    } else {
      decryptedText += char;
    }
  }
  return decryptedText;
};

export const decriptAffineCipher = async (req, res) => {
  const { password } = req.body;
  const a = 11;
  const b = 2;
  const text = rot13(password);
  const decryptedPassword = AffineCipher(text, a, b);
  console.log("sebelum di dekript", password);
  console.log("sesudah di dekript", decryptedPassword);
};



export const login = async (req, res) => {
  const { email, password } = req.body;
  const passwordDecrypt = await AffineCipherde(password, 11, 2);
  const emailDecrypt = await AffineCipherde(email, 11, 2);
  const sql = "SELECT * FROM users WHERE email = ? ";
  if (!email || !password) {
    response(400, "data not found", "Priksa kembali input", res);
    console.log("tidak ada email atau password")
  } else {
    db.query(sql, [emailDecrypt], async (err, data) => {
      if (data.length === 0) {
        response(400, "data not found", "Priksa kembali input", res);
      } else {
        if (emailDecrypt === data[0].email) {
          const passBcryptAfterDecrypt = await AffineCipherde (data[0].password, 11, 2)
          bcrypt.compare(passwordDecrypt, passBcryptAfterDecrypt, (err, result) => {
            if (result) {
              const username = data[0].username;
              const email = data[0].email;
              const expiresIn = 60 * 1;
              const accessToken = jwt.sign(
                { username, email},
                process.env.ACCESS_TOKEN_SECRET,
                {
                  expiresIn: expiresIn,
                }
              );
              response(200, accessToken, "berhasil login", res);
            } else {
              response(
                400,
                err,
                "Masukan email dan password dengan benar",
                res
              );
            }
          });
        } else {
          response(400, "invalid email", "Priksa kembali input", res);
        }
      }
    });
  }
};
