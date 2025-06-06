import connectDB from './db/index.js';
import dotenv from 'dotenv';
import { app } from './app.js';





dotenv.config({
    path:'./.env'
});




connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((error => {
    console.error('Error connecting to MongoDB:', error);
}));




// ;(async ()=>{

//     try {
//          await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//         throw error;
//     }
// })()