const nodemailer = require("nodemailer");
const Car=require('../models/car')

exports.orderEmail=async(email,hoadon,cthds)=>{
    try{
        let valueOrderString=``
        for(var item of cthds){
            const car=await Car.findOne({macar: item.macar})
            valueInvoiceString=valueInvoiceString+`
            <tr style="text-align:center;">
            <td style=" border: 1px solid #ddd;" >${item.macar}</td>
            <td style=" border: 1px solid #ddd;" >${car.ten}}</td>
            <td style=" border: 1px solid #ddd;" >${car.gia} VNĐ</td>
            <td style=" border: 1px solid #ddd;" >${item.soluong}</td>
            </tr>
            `
        }
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
        subject: "KingSpeed: Đơn đặt hàng", 
        text: "Đơn đặt hàng", 
        html: `<h2>King Speed xin kính chào quý khách!</h2>
        <h3>King Speed thông báo đơn đặt hàng của quý khách như sau: </h3>
        <table style="margin-left: 30px;">
            <tr>
                <th style="text-align:left">Mã đơn:</th>
                <td>${hoadon.mahd}</td>
            </tr>
            <tr>
                <th style="text-align:left">Mã khách hàng:</th>
                <td>${hoadon.makh}</td>
            </tr>
            <tr>
                <th style="text-align:left">Tên khách hàng:</th>
                <td>${hoadon.tenkh}</td>
            </tr>
            <tr>
                <th style="text-align:left">Mã nhân viên: </th>
                <td>${hoadon.manv}</td>
            </tr>
            <tr>
                <th style="text-align:left">Ngày đặt hàng: </th>
                <td>${hoadon.ngayhd}</td>
            </tr>
            <tr>
                <th style="text-align:left">Tình trạng: </th>
                <td>${hoadon.tinhtrang}</td>
            </tr>
        </table>
        <table style="border: 1px solid #ddd; border-collapse: collapse; margin-left: 30px;">
            <thead style=" background-color: #04AA6D; color: white;" >
                <th style=" border: 1px solid #ddd;" width="100px">Mã xe</th>
                <th style=" border: 1px solid #ddd;" width="200px">Tên xe</th>
                <th style=" border: 1px solid #ddd;" width="200px">Giá</th>
                <th style=" border: 1px solid #ddd;"width="100px">Số lượng</th>
            </thead>
            <tbody  style="background-color: #f2f2f2;">
                ${valueOrderString}
            </tbody>
        </table>
        <h4 style="color: #0b3c86;">Tổng tiền: ${hoadon.trigia} VNĐ</h4>
        <p style="color: red;">Quý khách vui thanh toán đơn đặt hàng trong vòng 15 ngày kể từ ngày đặt hàng.</p>
        <h3>Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của King Speed!</h3>`
        });
    return true
    }catch(e){
        return false
    }
    
}