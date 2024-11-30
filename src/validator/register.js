import validator from "validator"

const sanitazion = (data) => {
  return {
    username: validator.escape(validator.trim(data.username)),
    email: validator.escape(validator.trim(data.email)),
    password: validator.escape(validator.trim(data.password)),
  };
};

const regValid=(dt)=>{
    let message=[];
    let data = sanitazion(dt)
    if(validator.isEmpty(data.username)){
        message.push("nama tidak boleh kosong")
    }
    if(validator.isEmpty(data.email)){
        message.push("email tidak boleh kosong")
    }
    if(!validator.isEmail(data.email)){
        message.push("Email tidak valid")
    }
    if(validator.isEmpty(data.password)){
        message.push("Password Tidak Boleh Kosong")
    }
    // if(!validator.isStrongPassword(data.password)){
    //     message.push("Password harus terdiri dari 8 karakter, huruf besar, huruf kecil, angka dan simbol")
    // }
    return{message, data}
}

export default regValid