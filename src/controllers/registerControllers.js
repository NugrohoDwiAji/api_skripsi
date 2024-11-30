import bcrypt from "bcrypt";
import { db } from "../dbConennection.js";
import { response } from "../components/response.js";
import { AffineCipherde, decriptAffineCipher } from "./loginController.js";

function rot13(text) {
  return text.replace(/[a-zA-Z]/g, function (char) {
    let base = char <= "Z" ? 65 : 97; // 65 untuk 'A' dan 97 untuk 'a'
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function affineEncrypt(plaintext, a, b) {
  let text = rot13(plaintext);
  let encryptedText = "";
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    // Hanya mengenkripsi huruf a-z
    if (char.match(/[a-z]/i)) {
      let charCode = text.charCodeAt(i);
      let isUpperCase = charCode >= 65 && charCode <= 90;
      let base = isUpperCase ? 65 : 97; // ASCII untuk 'A' atau 'a'

      let encryptedCharCode = ((a * (charCode - base) + b) % 26) + base;
      encryptedText += String.fromCharCode(encryptedCharCode);
    } else {
      encryptedText += char; // Tetap biarkan karakter non-huruf
    }
  }
  return encryptedText;
}

function bcryptEncrypt(plaintext, salt) {
  return bcrypt.hash(plaintext, salt);
}

export const registerAffineCipher = async (req, res) => {
  const { password } = req.body;
  const a = 11;
  const b = 2;
  const encryptedPassword = affineEncrypt(password, a, b);
  console.log("ini password yang dienkripsi : ", encryptedPassword);
};




export const register = async (req, res) => {
  console.log(req.body);
  const { email, username, password } = req.body;
  const plainemail = await AffineCipherde(email, 11, 2);
  const plainpass = await AffineCipherde(password, 11, 2);
  const sql = "INSERT INTO users (email, username, password) VALUES (?, ?, ?);";
  const sql2 = "SELECT *  from users WHERE email = ?";
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(plainpass, salt, function (err, hashpass) {
      const cipherpass = affineEncrypt(hashpass, 11, 2);
      db.query(sql2, [plainemail], (err, result) => {
        if (result[0]?.email === plainemail) {
          response(400, "Invalid email", "Email telah digunakan", res);
        } else {
          db.query(sql, [plainemail, username, cipherpass], (err, result) => {
            if (err) {
              response(500, "Internal Server Error", "Terjadi kesalahan server", res);
            }else{
              response(201,result,"Registrasi Succesfull", res)
            }
          });
        }
      });
    });
  });
};



export const registerHybrid = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashPassword = await bcryptEncrypt(password, 10);
    const a = 11;
    const b = 2;
    const encryptedPassword = affineEncrypt(hashPassword, a, b);
    const affineCipher = affineEncrypt(password, a, b);
    console.log("Hybrid password : ", encryptedPassword);
    console.log("Affine Cipher password : ", affineCipher);
    console.log("Bcrypt password : ", hashPassword);
  } catch (error) {
    console.log(error);
  }
};
