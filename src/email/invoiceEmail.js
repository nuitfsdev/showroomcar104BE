const nodemailer = require("nodemailer");
const Car=require('../models/car')

exports.invoiceEmail=async(email,hoadon,cthds)=>{
    try{
        let valueInvoiceString=``
        for(var item of cthds){
            const car=await Car.findOne({macar: item.macar})
            valueInvoiceString=valueInvoiceString+`
            <tr style="text-align:center;">
            <td style=" border: 1px solid #ddd;" >${item.macar}</td>
            <td style=" border: 1px solid #ddd;" >${car.ten}</td>
            <td style=" border: 1px solid #ddd;" >${car.gia.toLocaleString()} VNĐ</td>
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
        subject: "KingSpeed: Hóa đơn", 
        text: "Hóa đơn", 
        html: `<h2>King Speed xin kính chào quý khách!</h2>
        <h3>Cảm ơn quý khách đã mua hàng tại King Speed!</h3>
        <h3>King Speed thông báo hóa đơn của quý khách như sau: </h3>
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
                ${valueInvoiceString}
            </tbody>
        </table>
        <h4 style="color: #0b3c86;">Tổng tiền: ${hoadon.trigia.toLocaleString()} VNĐ</h4>
        <h4 style="color: #035e21;">Vui lòng liên hệ Hotline 0943415138 nếu quý khách có thắc mắc về hóa đơn.</h4>
        <h3>Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của King Speed!</h3>`
        });
        return true
    }catch(e){
        throw new Error(e.message)
    }
    
}