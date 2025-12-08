import Order from "../models/order.js";

export async function createOrder(req, res) {

    // if (req.user == null) {
    //     res.status(401).json(
    //         {
    //             message: "Unauthorized User"
    //         }
    //     );
    //     return;
    // }
    
    try {
        const orderList = await Order.find().sort({date: -1}).limit(1);

        let orderID = "ACM0000001"

        if(orderList.length != 0){
            const lastOrderIDToString = orderList[0].orderID; //"ACM0001"
            const lastOrderNumberInString = lastOrderIDToString.replace("ACM", ""); //"0001"
            const lastOrderNumber = parseInt(lastOrderNumberInString) //1
            let newOrderNumber = lastOrderNumber + 1; //2
            //padStart
            const newOrderNumberInString = newOrderNumber.toString().padStart(7, '0');//"0000002"
            orderID = "ACM" + newOrderNumberInString; //"ACM0000002"
        }

        const newOrder = new Order({
            orderID : orderID,
            items : [],
            customerName : req.body.customerName,
            email : req.body.email,
            phone : req.body.phone,
            address : req.body.address,
            total : req.body.total
        })

        const savedOrder = await newOrder.save();

        res.status(201).json(
            {
                message: "Order Created Successfully",
                order: savedOrder
            }
        );

    }catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json(
            {
                message: "Internal Server Error"
            }
        );
    }

}