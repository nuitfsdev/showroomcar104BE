const Car=require('../models/car');

exports.getAllCar=async(req,res)=>{
    try{
        const limit=parseInt(req.query.pageSize) || 15;
        const skip=parseInt(req.query.pageIndex)*limit || 0;
        const filter={};
        if(req.query.ten){
            filter.ten={ "$regex": req.query.ten, "$options": "i" }
        }
        if(req.query.thuonghieu){
            filter.thuonghieu={ "$regex": req.query.thuonghieu, "$options": "i" }
        }
        if(req.query.macar){
            filter.macar=req.query.macar
        }
        if(req.query.search){
            if(req.query.search.startsWith("OT",0)){
                filter.macar=req.query.search
            }
            else{
                filter.ten={ "$regex": req.query.search, "$options": "i" }
            }
        }
        if(req.query.advice){
            filter.advice=req.query.advice
        }
        const cars= await Car.find(filter).skip(skip).limit(limit);
        const totalCarsFilter=await (await Car.find(filter)).length;
        const totalCars=await (await Car.find({})).length;
        res.send({totalCars,totalCarsFilter,cars})
    }catch(e){
        res.status(500).send()
    }  
}

exports.getCarByID=async (req,res)=>{
    const _id=req.params.id
    try{
        const car= await Car.findOne({_id})
        if(!car){
            return res.status(404).send("Not found")
        }
        res.send(car)
    }catch(e){
        res.status(500).send(e);
    }
}
exports.addCar=async (req, res)=>{
    const car= new Car({
        ...req.body
    })
    try{
        if(await (await Car.find({})).length!==0){
            const carLast= await (await Car.find({})).splice(-1)
            const macarLast= carLast[0].macar.substring(2) || "0" 
            const newmacar="OT"+ Number(Number(macarLast)+1)
            car.macar=newmacar
        }
        await car.save()
        res.status(201).send(car)
    }catch(e){
        res.status(400).send(e)
    }
}
exports.updateCar=async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowUpdates=["ten","thuonghieu","socho","dongco","kichthuoc","nguongoc","vantoctoida","dungtich", "tieuhaonhienlieu","congsuatcucdai","mausac","gia","hinhanh","mota","namsanxuat","soluong","advice"]
    const isValidOperation=updates.every((update)=>{
        return allowUpdates.includes(update)
    })
    if(!isValidOperation)
    {
        return res.status(400).send("error: Invalid updates!")
    }
    try{
        const car=await Car.findOne({_id: req.params.id})
        if(!car){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            car[update]=req.body[update]
        })
        await car.save()
        res.send(car)
    } catch(e){
        res.status(500).send(e)  
    }
}
exports.deleteCar=async(req,res)=>{
    try{
        const car= await Car.findByIdAndDelete({_id: req.params.id})
        if(!car){
            return res.status(404).send()
        }
        res.send(car)
    }catch(e){
        res.status(500).send(e)
    }
}