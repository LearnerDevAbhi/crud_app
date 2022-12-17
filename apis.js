const express = require("express");
const router = express.Router();
const uuid = require('uuid');

router.get('/', (req, res) => {
    res.status(200).send("MY NODE APP")
})
// bookregistration payload (body in json)

// {
// "name": "demo_book",
// "book_description": "this is book description",
// "author": "author_name",
// "price":760
// }
router.post('/bookregistration', async (req, res) => {
    try {
        let validationError = []
        let body=req.body
        body.book_name ? true : validationError.push({ "field": "book_name", "error": "mandatory parameter missing" })
        body.author ? true : validationError.push({ "field": "author", "error": "mandatory parameter missing" })
        if (validationError.length == 0) {
            let guid = uuid.v4()
            let insertData = await db.collection("books").insertOne({
                "_id": guid,
                "book_name": body.book_name,
                "book_description": body.book_description,
                "author": body.author,
                "price":body.price
            })
            if (insertData.acknowledged) {
                res.status(200).json({ "success": true, "id": insertData.insertedId })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Error while inserting record"
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Mandatory parameter(s) are missing.",
                validationError: validationError
            })
        }
    } catch (e) {
        console.log("Internal server error ",e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

// updatebook payload (body in json)

// {
// "id":"9ef7e1d8-358f-47b7-a145-50743b80127b"
// "name": "demo_book",
// "book_description": "this is book description",
// "author": "author_name",
// "price":760
// }
router.post('/updatebook', async (req, res) => {
    try {
        let validationError = []
        let body=req.body
        body.id ? true : validationError.push({ "field": "id", "error": "mandatory parameter missing" })
        if (validationError.length == 0) {
            let update_to_be = {}
            Object.keys(body).map((key) => {
                if (key != 'id') {
                    update_to_be[key] = body[key]
                }
            })

            let updateData = await db.collection("books").updateOne({ "_id": body.id }, { $set: update_to_be })
            console.log("updateData", updateData)
            if (updateData.acknowledged) {
                res.status(200).json({ "success": true, "message": "updated succesfully" })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Error while updating record"
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Mandatory parameter(s) are missing.",
                validationError: validationError
            })
        }
    } catch (e) {
        console.log("Internal server error ",e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

// get book payload (query params)

// "id":"9ef7e1d8-358f-47b7-a145-50743b80127b"  or "author": "author_name",
 
router.get('/getbooks', async (req, res) => {
    let validationError = []
    try {
        if (validationError.length == 0) {
            let filer = {}
            if (req.query.id) {
                filer = { "author": req.query.author }
            }
            if (req.query.id) {
                filer = { "_id": req.query.id }
            }
            let getData = await db.collection("books").find(filer).toArray()
            if (getData.length > 0) {
                res.status(200).json({ "success": true, "count": getData.length, "data": getData })
            } else {
                res.status(200).json({
                    success: false,
                    message: "no data found"
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Mandatory parameter(s) are missing.",
                validationError: validationError
            })
        }
    } catch (e) {
        console.log("Internal server error ",e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

})
// delete book payload (body in json)

// {
//     "id":"9ef7e1d8-358f-47b7-a145-50743b80127b"
// }
router.post('/deletebook', async (req, res) => {
    try {
        let validationError = []
        let body = req.body
        body.id ? true : validationError.push({ "field": "id", "error": "mandatory parameter missing" })
        if (validationError.length == 0) {
            let deleteData = await db.collection("books").findOneAndDelete({ "_id": body.id })
            if (deleteData.ok) {
                res.status(200).json({ "success": true, "message": "deleted succesfully" })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Error while deleting record"
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Mandatory parameter(s) are missing.",
                validationError: validationError
            })
        }
    } catch (e) {
        console.log("Internal server error ",e)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

module.exports = router


// try {

// } catch (e) {
//     res.status(500).json({
//         success: false,
//         message: "Internal Server Error"
//     })
// }