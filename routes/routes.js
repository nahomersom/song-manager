const express = require('express');
const Model = require('../models/song-model');

const router = express.Router();

module.exports = router;

//add New Song
router.post('/songs/add', async (req, res) => {

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
        const number = await Model.find({}).select({ "album": 1, "_id": 0}).countDocuments();
        console.log(number);
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
//Count Songs based on conditions
router.get('/songs/statistics',async (req, res) => {
    try{
        const songs = await Model.find().countDocuments()
        const artist = await Model.distinct('artist');
        const albums = await Model.distinct('album');
        const genre = await Model.distinct('genre');
        const songs_per_genre = await Model.aggregate([
            {
                $group:{
                    _id:"$genre",
                    songs:{$sum: 1}
                }
            }
        ])
        const songs_per_album = await Model.aggregate([
            {
                $group:{
                    _id:"$album",
                    songs:{$sum: 1}
                }
            }
        ])
        const songs_per_artist = await Model.aggregate([
            {
                $group:{
                    _id:"$artist",
                    
                    songs:{$sum: 1}
                }
            }
        ]);
        const albums_per_artist = await Model.aggregate([
            {
                $group: {
                    _id: {
                      artist: "$artist"
                    }
                  }
                },
                {
                  $group: {
                    _id: "$_id.artist",
                    "album": { $sum: 1 }
                  }
                
            }
        ]);
    
        res.json({
            songs: songs,
            artists:artist.length,
            albums: albums.length,
            genre: genre.length,
            songs_per_genre:songs_per_genre,
            songs_per_album:songs_per_album,
            songs_per_artist:songs_per_artist,
            albums_per_artist:albums_per_artist
        }
            )
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})