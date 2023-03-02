const express = require('express');
const Model = require('../models/song-model');

const router = express.Router();

module.exports = router;

//add New Song
router.post('/songs/add', async (req, res) => {
    console.log('post',req.body)
    const data = new Model({
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        genre: req.body.genre
    })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Songs
router.get('/songs/getAll',async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get Single Song by ID
router.get('/songs/getOne/:id', async (req, res) => {
    try{
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Update Song by ID 
router.patch('/songs/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete a Song
router.delete('/songs/delete/:id',async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Song with ${data.artist} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})