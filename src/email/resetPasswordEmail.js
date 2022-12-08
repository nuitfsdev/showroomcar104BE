const nodemailer = require("nodemailer");

exports.resetPasswordEmail=(email,token)=>{
    try{
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSMAIL
        },
    });
    transporter.sendMail({
        from: process.env.USERMAIL, 
        to: `${email}`, 
        subject: "KingSpeed: Quên mật khẩu", 
        text: "Quên mật khẩu?", 
        html: `<h2>King Speed xin kính chào quý khách!</h2>
               <p>Để đổi lại mật khẩu cho tài khoản của quý khách. Vùi lòng nhấn vào nút bên dưới để thực hiện đổi mật khẩu!</p>
               <a href="${process.env.URLCLIENT}/${token}" style="display:block; width: max-content; padding: 8px;  color: rgb(255, 255, 255); background: #078989; border-radius: 8px;margin-left: 150px;text-decoration: none;">Đặt lại mật khẩu</a>
               <h6 style="margin-left: 100px ; color: red;">Email này chỉ có hiệu lực trong vòng 20 phút!</h6>
               <p>Nếu quý khách không thực hiện yêu cầu này! Xin quý khách vui lòng bỏ qua email này.</p>
               <h3>Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của King Speed!</h3>`
        });
    return true
    }catch(e){
        return false
    }
    
}